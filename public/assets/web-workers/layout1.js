// Wait for the initial message event.
self.addEventListener('message', function(e) {
  let { reducedLandscape } = e.data;

  let kielerGraph = layout1(reducedLandscape);
  postMessage(kielerGraph);
}, false);

// Ping the Ember service to say that everything is ok.
postMessage(true);

const CONVERT_TO_KIELER_FACTOR = 180.0;

function layout1(landscape) {
  let topLevelKielerGraph = {};

  // Maps for internal computations
  let modelIdToGraph = new Map();
  let modelIdToSourcePort = new Map();
  let modelIdToTargetPort = new Map();
  let modeldToKielerEdgeReference = new Map();

  // Maps for output
  let modelIdToPoints = new Map();

  const graph = createEmptyGraph("root");
  topLevelKielerGraph = graph;

  addNodes(landscape, topLevelKielerGraph);
  // addEdges(landscape);

  return {
    graph,
    modelIdToPoints
  };

  function createEmptyGraph(id) {
  
    const layoutOptions = {
      "edgeRouting": "POLYLINE",
      "spacing": 0.2 * CONVERT_TO_KIELER_FACTOR,
      "borderSpacing": 0.2 * CONVERT_TO_KIELER_FACTOR,
      "direction": "RIGHT",
      "interactive": true,
      "nodePlace": "LINEAR_SEGMENTS",
      "unnecessaryBendpoints": true,
      "edgeSpacingFactor": 1.0
    };
  
    const graph = {
      "id": id,
      "properties": layoutOptions,
      "children": [],
      "edges": []
    };
  
    return graph;
  }


  function addEdges(landscape) {

    const totalApplicationCommunications = landscape.applicationCommunications;

    totalApplicationCommunications.forEach((applicationcommunication) => {

      modeldToKielerEdgeReference.set(applicationcommunication.id, []);

      modelIdToPoints.set(applicationcommunication.id, []);

      let appSource = applicationcommunication.sourceApplication;
      let appTarget = applicationcommunication.targetApplication;

      let sourceNode = appSource.parent;
      let sourceNodeGroup = sourceNode.parent;
      let sourceSystem = sourceNodeGroup.parent;

      let targetNode = appTarget.parent;
      let targetNodeGroup = targetNode.parent;
      let targetSystem = targetNodeGroup.parent;

      if (appSource.id !== appTarget.id) {
        const edge = createEdgeBetweenSourceTarget(appSource, appTarget, applicationcommunication.id);
        let edgeReference = modeldToKielerEdgeReference.get(applicationcommunication.id);
        edgeReference.push(edge);
      }
    });
  } // END addEdges

  function addNodes(landscape, kielerGraph) {
    const nodes = landscape.nodes;

    nodes.forEach((node) => {
      createNodeAndItsApplications(kielerGraph, node);
    });
  } // END addNodes

  function createNodeAndItsApplications(kielerParentGraph, node) {

    const PADDING = 0.1;
    const NODE_LABEL_HEIGHT = 0.2;
    const DEFAULT_WIDTH = 1.5;
    const DEFAULT_HEIGHT = 0.75;

    const nodeKielerGraph = createEmptyGraph(node.ipAddress);
    modelIdToGraph.set(node.ipAddress, nodeKielerGraph);

    nodeKielerGraph.padding = {
      left: PADDING * CONVERT_TO_KIELER_FACTOR,
      right: PADDING * CONVERT_TO_KIELER_FACTOR,
      top: PADDING * CONVERT_TO_KIELER_FACTOR,
      bottom: 6 * PADDING * CONVERT_TO_KIELER_FACTOR
    };

    const minWidth = Math.max(DEFAULT_WIDTH *
      CONVERT_TO_KIELER_FACTOR,
      (calculateRequiredLabelLength(getDisplayName(node), NODE_LABEL_HEIGHT) +
        PADDING * 2.0) * CONVERT_TO_KIELER_FACTOR);

    const minHeight = DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;

    if (!nodeKielerGraph.properties || !kielerParentGraph.children)
      return;

    nodeKielerGraph.properties["de.cau.cs.kieler.sizeConstraint"] = "MINIMUM_SIZE";
    nodeKielerGraph.properties["de.cau.cs.kieler.minWidth"] = minWidth;
    nodeKielerGraph.properties["de.cau.cs.kieler.minHeight"] = minHeight;
    nodeKielerGraph.properties["de.cau.cs.kieler.klay.layered.contentAlignment"] = "V_CENTER,H_CENTER";

    kielerParentGraph.children.push(nodeKielerGraph);

    const applications = node.applications;

    applications.forEach((application) => {

      const DEFAULT_WIDTH = 1.5;
      const DEFAULT_HEIGHT = 0.75;

      const APPLICATION_PIC_SIZE = 0.16;
      const APPLICATION_PIC_PADDING_SIZE = 0.15;
      const APPLICATION_LABEL_HEIGHT = 0.21;

      const width = Math.max(DEFAULT_WIDTH * CONVERT_TO_KIELER_FACTOR,
        (calculateRequiredLabelLength(application.name, APPLICATION_LABEL_HEIGHT) +
          APPLICATION_PIC_PADDING_SIZE + APPLICATION_PIC_SIZE +
          PADDING * 3.0) * CONVERT_TO_KIELER_FACTOR);

      const height = DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;

      const applicationKielerNode = {
        "id": application.pid,
        "width": width,
        "height": height,
        "children": [],
        "edges": [],
        "ports": []
      };

      modelIdToGraph.set(application.pid, applicationKielerNode);

      if (nodeKielerGraph.children)
        nodeKielerGraph.children.push(applicationKielerNode);
    });

  } // END createNodeAndItsApplications

  function createEdgeBetweenSourceTarget(sourceApplication, targetApplication, commId) {

    const port1 = createSourcePortIfNotExisting(sourceApplication);
    const port2 = createTargetPortIfNotExisting(targetApplication);

    let edge = createEdgeHelper(sourceApplication, port1, targetApplication, port2, commId);
    return edge;

    //---------------------------inner functions
    function createSourcePortIfNotExisting(sourceDrawnode) {

      // Do not create duplicate port
      let maybePort = modelIdToSourcePort.get(sourceDrawnode.ipAddress);
      if (maybePort && modelIdToSourcePort.has(sourceDrawnode.ipAddress)){
        return maybePort;
      } else {
        const DEFAULT_PORT_WIDTH = 0.000001;

        const DEFAULT_PORT_HEIGHT = 0.000001;
  
        const CONVERT_TO_KIELER_FACTOR = 180;

        const portId = sourceDrawnode.ipAddress + "_sp1";

        let port = {
          id: portId,
          width: DEFAULT_PORT_WIDTH * CONVERT_TO_KIELER_FACTOR,
          height: DEFAULT_PORT_HEIGHT * CONVERT_TO_KIELER_FACTOR,
          properties: {
            "de.cau.cs.kieler.portSide": "EAST"
          },
          x: 0,
          y: 0
        };

        let sourceGraph = modelIdToGraph.get(sourceDrawnode.ipAddress);
        port.node = sourceGraph;

        modelIdToSourcePort.set(sourceDrawnode.ipAddress, port);
        sourceGraph?.ports?.push(port);

        return port;
      }
    }


    function createTargetPortIfNotExisting(targetDrawnode) {

      // Do not create duplicate port
      let maybePort = modelIdToTargetPort.get(targetDrawnode.ipAddress);
      if (maybePort && modelIdToTargetPort.has(targetDrawnode.ipAddress)){
        return maybePort;
      } else {
        const DEFAULT_PORT_WIDTH = 0.000001;

        const DEFAULT_PORT_HEIGHT = 0.000001;
  
        const CONVERT_TO_KIELER_FACTOR = 180;

        const portId = targetDrawnode.ipAddress + "_tp1";

        let port = {
          id: portId,
          width: DEFAULT_PORT_WIDTH * CONVERT_TO_KIELER_FACTOR,
          height: DEFAULT_PORT_HEIGHT * CONVERT_TO_KIELER_FACTOR,
          properties: {
            "de.cau.cs.kieler.portSide": "WEST"
          },
          x: 0,
          y: 0
        };

        let targetGraph = modelIdToGraph.get(targetDrawnode.ipAddress);
        port.node = targetGraph;

        modelIdToTargetPort.set(targetDrawnode.ipAddress, port);
        targetGraph?.ports?.push(port);

        return port;
      }
    }

    //---------------------------- end inner functions

  } // END createEdgeBetweenSourceTarget

  function createEdgeHelper(sourceDrawnode, port1, targetDrawnode, port2, commId) {

    const id = sourceDrawnode.ipAddress + "_to_" + targetDrawnode.ipAddress;

    let edge = lookForExistingEdge(sourceDrawnode, id);

    if (edge) {
      return edge;
    }

    edge = createNewEdge(id);

    setEdgeLayoutProperties(edge);

    edge.source = sourceDrawnode.ipAddress;
    edge.target = targetDrawnode.ipAddress;

    edge.sourcePort = port1.id;
    edge.targetPort = port2.id;

    if (port1.x && port1.y)
      edge.sourcePoint = { x: port1.x, y: port1.y };
    
    if (port2.x && port2.y)
      edge.targetPoint = { x: port2.x, y: port2.y };

    edge.sPort = port1;
    edge.tPort = port2;

    edge.sourceNode = sourceDrawnode;
    edge.targetNode = targetDrawnode;

    edge.communicationId = commId;

    let graph = modelIdToGraph.get(sourceDrawnode.ipAddress);
    graph?.edges?.push(edge);

    return edge;


    //inner function
    // looks for already existing edges
    function lookForExistingEdge(sourceDrawnode, id) {
      let edges = modelIdToGraph.get(sourceDrawnode.ipAddress)?.edges;
      if (edges) {
        let length = edges.length;
        for (let i = 0; i < length; i++) {
          if (edges[i].id === id) {
            return edges[i];
          }
        }
      }
      return undefined;
    }

  } // END createEdgeHelper

  function createNewEdge(id) {
    const kielerEdge = {
      id: id
    };
    return kielerEdge;
  }

  function setEdgeLayoutProperties(edge) {
    const lineThickness = 0.06 * 4.0 + 0.01;
    const oldThickness = edge.thickness ? edge.thickness : 0.0;
    edge.thickness = Math.max(lineThickness * CONVERT_TO_KIELER_FACTOR, oldThickness);
  }

  function getDisplayName(node) {

    if (node.hostName && node.hostName.length !== 0 && !node.hostName.startsWith("<")) {
      return node.hostName;
    } else {
      return node.ipAddress;
    }
  }

  function calculateRequiredLabelLength(text, quadSize) {

    if (text === null || text === "") {
      return 0;
    }

    return text.length * quadSize;
  }
}
