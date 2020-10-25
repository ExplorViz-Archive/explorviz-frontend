// Wait for the initial message event.
self.addEventListener('message', function(e) {
  let { reducedLandscape, openEntitiesIds } = e.data;

  let kielerGraph = layout1(reducedLandscape, openEntitiesIds);
  postMessage(kielerGraph);
}, false);

// Ping the Ember service to say that everything is ok.
postMessage(true);

const CONVERT_TO_KIELER_FACTOR = 180.0;
  
const PADDING = 0.1;

function layout1(landscape, openEntitiesIds) {
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

  addNodes(landscape);
  addEdges(landscape);

  return {
    graph,
    modelIdToPoints
  };

  function createEmptyGraph(id) {
  
    const spacing = 0.2 * CONVERT_TO_KIELER_FACTOR;

    const layoutOptions = {
      "elk.edgeRouting": "POLYLINE",
      "elk.hierarchyHandling": "INCLUDE_CHILDREN",
      "elk.spacing.nodeNode": spacing,
      "elk.layered.spacing.nodeNodeBetweenLayers": 2.5 * spacing,
      "elk.direction": "RIGHT",
      "elk.interactive": true,
      "elk.layered.nodePlacement.strategy": "LINEAR_SEGMENTS",
      "elk.layered.unnecessaryBendpoints": true,
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
  
  
  function addNodes(landscape) {
    const systems = landscape.systems;
  
    if (systems) {
  
      systems.forEach((system) => {
  
        const DEFAULT_WIDTH = 1.5;
        const DEFAULT_HEIGHT = 0.75;
        const SYSTEM_LABEL_HEIGHT = 0.4;
  
        if (isOpen(system)) {
  
          const minWidth = Math.max(2.5 * DEFAULT_WIDTH *
            CONVERT_TO_KIELER_FACTOR,
            (calculateRequiredLabelLength(system.name, SYSTEM_LABEL_HEIGHT) +
              PADDING * 6.0) * CONVERT_TO_KIELER_FACTOR);
  
          const minHeight = 2.5 * DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;
  
          const systemKielerGraph = createEmptyGraph(system.id);
          modelIdToGraph.set(system.id, systemKielerGraph);
  
          if (!systemKielerGraph.properties)
            return;
  
          systemKielerGraph.properties["elk.nodeSize.constraints"] = "MINIMUM_SIZE";
          systemKielerGraph.properties["elk.nodeSize.minimum"] = "( "+ minWidth+", " + minHeight + ")";
          systemKielerGraph.properties["elk.contentAlignment"] = "V_CENTER, H_CENTER";

          // kieler scaled padding
          const ksp = 2.5 * PADDING * CONVERT_TO_KIELER_FACTOR;
    
          systemKielerGraph.properties['elk.padding'] = `[top=${4 * ksp}, left=${ksp}, bottom=${ksp}, right=${ksp}]`;
  
          if (!topLevelKielerGraph.children)
            return;
  
          topLevelKielerGraph.children.push(systemKielerGraph);
  
          const nodegroups = system.nodeGroups;
  
          nodegroups.forEach((nodeGroup) => {
  
            if (isVisible(nodeGroup)) {
              createNodeGroup(systemKielerGraph, nodeGroup);
            }
  
          });
  
        } else {
  
          const width = Math.max(2.5 * DEFAULT_WIDTH *
            CONVERT_TO_KIELER_FACTOR,
            (calculateRequiredLabelLength(system.name, SYSTEM_LABEL_HEIGHT) +
              PADDING * 6.0) * CONVERT_TO_KIELER_FACTOR);
  
          const height = 2.5 * DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;

          // kieler scaled padding
          const ksp = 2.5 * PADDING * CONVERT_TO_KIELER_FACTOR;
  
          const systemKielerNode = {
            "id": system.id,
            "width": width,
            "height": height,
            "edges": [],
            "ports": [],
            "properties": {
              "elk.padding": `[top=${3 * ksp}, left=${ksp}, bottom=${ksp}, right=${ksp}]`
            }
          };

          modelIdToGraph.set(system.id, systemKielerNode);
  
          if (!topLevelKielerGraph.children)
            return;
          topLevelKielerGraph.children.push(systemKielerNode);
  
        }
      });
    }
  
  } // END addNodes


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

      if (!isVisible(sourceNode)) {
        let maybeSource = isOpen(sourceSystem) ? seekRepresentativeApplication(appSource) : sourceSystem;
        if (maybeSource) appSource = maybeSource;
      }

      let targetNode = appTarget.parent;
      let targetNodeGroup = targetNode.parent;
      let targetSystem = targetNodeGroup.parent;

      if (!isVisible(targetNode)) {
        let maybeTarget = isOpen(targetSystem) ? seekRepresentativeApplication(appTarget) : targetSystem;
        if (maybeTarget) appTarget = maybeTarget;
      }

      if (appSource.id !== appTarget.id) {
        const edge = createEdgeBetweenSourceTarget(appSource, appTarget, applicationcommunication.id);
        let edgeReference = modeldToKielerEdgeReference.get(applicationcommunication.id);
        edgeReference.push(edge);
      }
    });
  } // END addEdges

  function createNodeGroup(systemKielerGraph, nodegroup) {

    const nodes = nodegroup.nodes;

    if (nodes.length > 1) {

      const nodeGroupKielerGraph = createEmptyGraph(nodegroup.id);
      modelIdToGraph.set(nodegroup.id, nodeGroupKielerGraph);

      if (!nodeGroupKielerGraph.properties || !systemKielerGraph.children)
        return;

      nodeGroupKielerGraph.properties["elk.layered.crossingMinimization.strategy"] = "LAYER_SWEEP";

      // kieler scaled padding
      const ksp = 2.5 * PADDING * CONVERT_TO_KIELER_FACTOR;
  
      nodeGroupKielerGraph.properties['elk.padding'] = `[top=${1.5 * ksp}, left=${ksp}, bottom=${1.5 * ksp}, right=${ksp}]`;
  
      systemKielerGraph.children.push(nodeGroupKielerGraph);

      let yCoord = 0.0;

      nodes.forEach((node) => {

        if (isVisible(node)) {
          createNodeAndItsApplications(nodeGroupKielerGraph, node);
          let kielerGraphReference = modelIdToGraph.get(node.id);

          if (kielerGraphReference) {
            kielerGraphReference.x = 0;
            kielerGraphReference.y = yCoord;
            yCoord += CONVERT_TO_KIELER_FACTOR;
          }

        }

      });

    } else {

      nodes.forEach((node) => {

        if (isVisible(node)) {
          createNodeAndItsApplications(systemKielerGraph, node);
        }

      });

    }

  } // END createNodeGroup

  /**
   * Searches for an application with the same name as the 
   * given application within the same nodegroup. This can be
   * be done because a nodegroup only contains nodes which run
   * the same applications.
   * @param application 
   */
  function seekRepresentativeApplication(application) {
    let parentNode = application.parent;
    let parentNodeGroup = parentNode.parent;

    let nodes = parentNodeGroup.nodes;

    let returnValue = null;

    nodes.forEach((node) => {
      if (isVisible(node)) {

        const applications = node.applications;

        applications.forEach((representiveApplication) => {

          if (representiveApplication.name === application.name) {
            returnValue = representiveApplication;
          }
        });
      }
    });

    return returnValue;
  }

  function createNodeAndItsApplications(kielerParentGraph, node) {

    const NODE_LABEL_HEIGHT = 0.2;
    const DEFAULT_WIDTH = 1.5;
    const DEFAULT_HEIGHT = 0.75;

    const nodeKielerGraph = createEmptyGraph(node.id);
    modelIdToGraph.set(node.id, nodeKielerGraph);

    // kieler scaled padding
    const ksp = 2.5 * PADDING * CONVERT_TO_KIELER_FACTOR;

    nodeKielerGraph.properties['elk.padding'] = `[top=${ksp}, left=${ksp}, bottom=${3 * ksp}, right=${ksp}]`;

    const parent = node.parent;

    const minWidth = Math.max(DEFAULT_WIDTH *
      CONVERT_TO_KIELER_FACTOR,
      (calculateRequiredLabelLength(getDisplayName(parent, node), NODE_LABEL_HEIGHT) +
        PADDING * 2.0) * CONVERT_TO_KIELER_FACTOR);

    const minHeight = DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;

    if (!nodeKielerGraph.properties || !kielerParentGraph.children)
      return;

    nodeKielerGraph.properties["elk.nodeSize.constraints"] = "MINIMUM_SIZE";
    nodeKielerGraph.properties["elk.nodeSize.minimum"] =  "( "+ minWidth+", " + minHeight + "})";
    nodeKielerGraph.properties["elk.contentAlignment"] = "V_CENTER,H_CENTER";

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
        "id": application.id,
        "width": width,
        "height": height,
        "children": [],
        "edges": [],
        "ports": []
      };

      modelIdToGraph.set(application.id, applicationKielerNode);

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
      let maybePort = modelIdToSourcePort.get(sourceDrawnode.id);
      if (maybePort && modelIdToSourcePort.has(sourceDrawnode.id)){
        return maybePort;
      } else {
        const DEFAULT_PORT_WIDTH = 0.000001;

        const DEFAULT_PORT_HEIGHT = 0.000001;
  
        const CONVERT_TO_KIELER_FACTOR = 180;

        const portId = sourceDrawnode.id + "_sp1";

        let port = {
          id: portId,
          width: DEFAULT_PORT_WIDTH * CONVERT_TO_KIELER_FACTOR,
          height: DEFAULT_PORT_HEIGHT * CONVERT_TO_KIELER_FACTOR,
          properties: {
            "elk.port.side": "EAST"
          },
          x: 0,
          y: 0
        };

        let sourceGraph = modelIdToGraph.get(sourceDrawnode.id);
        port.node = sourceGraph;

        modelIdToSourcePort.set(sourceDrawnode.id, port);
        sourceGraph?.ports?.push(port);

        return port;
      }
    }


    function createTargetPortIfNotExisting(targetDrawnode) {

      // Do not create duplicate port
      let maybePort = modelIdToTargetPort.get(targetDrawnode.id);
      if (maybePort && modelIdToTargetPort.has(targetDrawnode.id)){
        return maybePort;
      } else {
        const DEFAULT_PORT_WIDTH = 0.000001;

        const DEFAULT_PORT_HEIGHT = 0.000001;
  
        const CONVERT_TO_KIELER_FACTOR = 180;

        const portId = targetDrawnode.id + "_tp1";

        let port = {
          id: portId,
          width: DEFAULT_PORT_WIDTH * CONVERT_TO_KIELER_FACTOR,
          height: DEFAULT_PORT_HEIGHT * CONVERT_TO_KIELER_FACTOR,
          properties: {
            "elk.port.side": "WEST"
          },
          x: 0,
          y: 0
        };

        let targetGraph = modelIdToGraph.get(targetDrawnode.id);
        port.node = targetGraph;

        modelIdToTargetPort.set(targetDrawnode.id, port);
        targetGraph?.ports?.push(port);

        return port;
      }
    }

    //---------------------------- end inner functions

  } // END createEdgeBetweenSourceTarget

  function createEdgeHelper(sourceDrawnode, port1, targetDrawnode, port2, commId) {

    const id = sourceDrawnode.id + "_to_" + targetDrawnode.id;

    let edge = lookForExistingEdge(sourceDrawnode, id);

    if (edge) {
      return edge;
    }

    edge = createNewEdge(id);

    setEdgeLayoutProperties(edge);

    edge.source = sourceDrawnode.id;
    edge.target = targetDrawnode.id;

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

    let graph = modelIdToGraph.get(sourceDrawnode.id);
    graph?.edges?.push(edge);

    return edge;


    //inner function
    // looks for already existing edges
    function lookForExistingEdge(sourceDrawnode, id) {
      let edges = modelIdToGraph.get(sourceDrawnode.id)?.edges;
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

  function getDisplayName(nodeGroup, node) {

    if (isOpen(nodeGroup)) {
      if (node.name && node.name.length !== 0 && !node.name.startsWith("<")) {
        return node.name;
      } else {
        return node.ipAddress;
      }
    } else {
      return nodeGroup.name;
    }
  }

  function calculateRequiredLabelLength(text, quadSize) {

    if (text === null || text === "") {
      return 0;
    }

    return text.length * quadSize;
  }

  function isOpen(entity) {    
    if (isReducedNodeGroup(entity)) {
      return entity.nodes.length < 2 || openEntitiesIds.has(entity.id);
    } else {
      return openEntitiesIds.has(entity.id);
    }
  }

  function isVisible(entity) {
    if (isReducedNodeGroup(entity)) {
      let system = entity.parent;
      return isOpen(system);
    } else if (isReducedNode(entity)) {
      let nodeGroup = entity.parent;
      if (isOpen(nodeGroup)) {
        return isVisible(nodeGroup);
      } else {
        let nodes = nodeGroup.nodes;
        return nodes[0]?.id === entity.id && isVisible(nodeGroup);
      }
    } else if (isReducedApplication(entity)) {
      let node = entity.parent;
      return isVisible(node);
    } else {
      return false;
    }
  }

  function isReducedNodeGroup(arg) {
    return arg.nodes !== undefined;
  }

  function isReducedNode(arg) {
    return arg.applications !== undefined;
  }

  function isReducedApplication(arg) {
    return arg.type !== undefined && arg.type === 'application';
  }
}
