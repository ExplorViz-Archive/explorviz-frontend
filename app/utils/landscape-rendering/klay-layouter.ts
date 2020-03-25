import Landscape from "explorviz-frontend/models/landscape";
import NodeGroup from "explorviz-frontend/models/nodegroup";
import Node from "explorviz-frontend/models/node";
import Application from "explorviz-frontend/models/application";
import DrawNodeEntity from "explorviz-frontend/models/drawnodeentity";
import PlaneLayout from "explorviz-frontend/view-objects/layout-models/plane-layout";
import System from "explorviz-frontend/models/system";
import DS from "ember-data";

/* global $klay */

type kielerGraph = {
  id?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  properties?: layoutOptions;
  children?: kielerGraph[];
  edges?: edge[];
  ports?: port[];
  padding?: padding;
}

type edge = {
  id?: string;
  thickness?: number;
  sourcePoint?: point;
  targetPoint?: point;
  bendPoints?: point[];
  source?: string;
  target?: string;
  sourceNode?: DrawNodeEntity;
  targetNode?: DrawNodeEntity;
  sourcePort?: string;
  targetPort?: string;
  sPort?: port;
  tPort?: port;
}

type point = {
  x: number;
  y: number;
}

type padding = {
  top: number;
  right: number;
  left: number;
  bottom: number;
}

type layoutOptions = {
  edgeRouting?: string;
  spacing?: number;
  borderSpacing?: number;
  direction?: string;
  interactive?: boolean;
  nodePlace?: string;
  unnecessaryBendpoints?: boolean;
  edgeSpacingFactor?: number;
  "de.cau.cs.kieler.sizeConstraint"?: string;
  "de.cau.cs.kieler.minWidth"?: number;
  "de.cau.cs.kieler.minHeight"?: number;
  "de.cau.cs.kieler.klay.layered.contentAlignment"?: string;
  "de.cau.cs.kieler.portSide"?: string;
  "de.cau.cs.kieler.klay.layered.crossMin"?: string;
}

type port = {
  id?: string;
  width?: number;
  height?: number;
  properties?: layoutOptions;
  x?: number;
  y?: number;
  node?: kielerGraph | null;
};

export default function applyKlayLayout(landscape: Landscape, openEntitiesIds: Set<string>) {

  let topLevelKielerGraph: kielerGraph = {};

  const CONVERT_TO_KIELER_FACTOR = 180.0;

  let modelIdToGraph: Map<string, kielerGraph> = new Map();
  let modelIdToLayout: Map<string, PlaneLayout> = new Map();

  let modelIdToSourcePort: Map<string, port> = new Map();
  let modelIdToTargetPort: Map<string, port> = new Map();
  let modeldToKielerEdgeReference: Map<string, any> = new Map();

  setupKieler(landscape);
  updateGraphWithResults(landscape);

  return modelIdToLayout;

  // Functions

  function setupKieler(landscape: Landscape) {

    const graph = createEmptyGraph("root");
    topLevelKielerGraph = graph;

    addNodes(landscape);
    addEdges(landscape);

    // Do actual layout
    // @ts-ignore
    $klay.layout({
      graph: graph,
      success: function () { // eslint-disable-line
        //
      },
      error: function () { // eslint-disable-line
        //console.log("error", error);
      }
    });

  }

  function createEmptyGraph(id: string) {

    const layoutOptions: layoutOptions = {
      "edgeRouting": "POLYLINE",
      "spacing": 0.2 * CONVERT_TO_KIELER_FACTOR,
      "borderSpacing": 0.2 * CONVERT_TO_KIELER_FACTOR,
      "direction": "RIGHT",
      "interactive": true,
      "nodePlace": "LINEAR_SEGMENTS",
      "unnecessaryBendpoints": true,
      "edgeSpacingFactor": 1.0
    };

    const graph: kielerGraph = {
      "id": id,
      "properties": layoutOptions,
      "children": [],
      "edges": []
    };

    return graph;
  }


  function addNodes(landscape: Landscape) {
    const systems = landscape.get('systems');

    if (systems) {

      systems.forEach((system) => {

        const DEFAULT_WIDTH = 1.5;
        const DEFAULT_HEIGHT = 0.75;

        const PADDING = 0.1;
        const SYSTEM_LABEL_HEIGHT = 0.4;

        system.set('sourcePorts', {});
        system.set('targetPorts', {});

        if (isOpen(system)) {

          const minWidth = Math.max(2.5 * DEFAULT_WIDTH *
            CONVERT_TO_KIELER_FACTOR,
            (calculateRequiredLabelLength(system.get('name'), SYSTEM_LABEL_HEIGHT) +
              PADDING * 6.0) * CONVERT_TO_KIELER_FACTOR);

          const minHeight = 2.5 * DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;

          const systemKielerGraph = createEmptyGraph(system.get('id'));
          modelIdToGraph.set(system.get('id'), systemKielerGraph);

          if (!systemKielerGraph.properties)
            return;

          systemKielerGraph.properties["de.cau.cs.kieler.sizeConstraint"] = "MINIMUM_SIZE";
          systemKielerGraph.properties["de.cau.cs.kieler.minWidth"] = minWidth;
          systemKielerGraph.properties["de.cau.cs.kieler.minHeight"] = minHeight;
          systemKielerGraph.properties["de.cau.cs.kieler.klay.layered.contentAlignment"] = "V_CENTER, H_CENTER";

          systemKielerGraph.padding = {
            left: PADDING * CONVERT_TO_KIELER_FACTOR,
            right: PADDING * CONVERT_TO_KIELER_FACTOR,
            top: 8 * PADDING * CONVERT_TO_KIELER_FACTOR,
            bottom: PADDING * CONVERT_TO_KIELER_FACTOR
          };

          if (!topLevelKielerGraph.children)
            return;

          topLevelKielerGraph.children.push(systemKielerGraph);

          const nodegroups = system.get('nodegroups');

          nodegroups.forEach((nodegroup) => {

            nodegroup.set('sourcePorts', {});
            nodegroup.set('targetPorts', {});

            if (isVisible(nodegroup)) {
              createNodeGroup(systemKielerGraph, nodegroup);
            }

          });

        } else {

          const width = Math.max(2.5 * DEFAULT_WIDTH *
            CONVERT_TO_KIELER_FACTOR,
            (calculateRequiredLabelLength(system.get('name'), SYSTEM_LABEL_HEIGHT) +
              PADDING * 6.0) * CONVERT_TO_KIELER_FACTOR);

          const height = 2.5 * DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;

          const systemKielerNode: kielerGraph = {
            "id": system.get('id'),
            "width": width,
            "height": height,
            "edges": [],
            "ports": []
          };

          systemKielerNode.padding = {
            left: PADDING * CONVERT_TO_KIELER_FACTOR,
            right: PADDING * CONVERT_TO_KIELER_FACTOR,
            top: PADDING * CONVERT_TO_KIELER_FACTOR,
            bottom: PADDING * CONVERT_TO_KIELER_FACTOR
          };

          modelIdToGraph.set(system.get('id'), systemKielerNode);

          if (!topLevelKielerGraph.children)
            return;
          topLevelKielerGraph.children.push(systemKielerNode);

        }
      });
    }

  } // END addNodes

  function createNodeGroup(systemKielerGraph: kielerGraph, nodegroup: NodeGroup) {

    const nodes = nodegroup.get('nodes');
    const PADDING = 0.1;

    if (nodes.get('length') > 1) {

      const nodeGroupKielerGraph = createEmptyGraph(nodegroup.get('id'));
      modelIdToGraph.set(nodegroup.get('id'), nodeGroupKielerGraph);

      if (!nodeGroupKielerGraph.properties || !systemKielerGraph.children)
        return;

      nodeGroupKielerGraph.properties["de.cau.cs.kieler.klay.layered.crossMin"] = "LAYER_SWEEP";


      nodeGroupKielerGraph.padding = {
        left: PADDING * CONVERT_TO_KIELER_FACTOR,
        right: PADDING * CONVERT_TO_KIELER_FACTOR,
        top: PADDING * CONVERT_TO_KIELER_FACTOR,
        bottom: PADDING * CONVERT_TO_KIELER_FACTOR
      };

      systemKielerGraph.children.push(nodeGroupKielerGraph);

      const sortedNodes = nodes.sortBy('ipAddress');

      nodegroup.set('nodes', sortedNodes);


      let yCoord = 0.0;

      sortedNodes.forEach((node) => {

        node.set('sourcePorts', {});
        node.set('targetPorts', {});

        if (isVisible(node)) {
          createNodeAndItsApplications(nodeGroupKielerGraph, node);
          let kielerGraphReference = modelIdToGraph.get(node.get('id'));

          if (kielerGraphReference) {
            kielerGraphReference.x = 0;
            kielerGraphReference.y = yCoord;
            yCoord += CONVERT_TO_KIELER_FACTOR;
          }

        }

      });

    } else {

      nodes.forEach((node) => {

        node.set('sourcePorts', {});
        node.set('targetPorts', {});

        if (isVisible(node)) {
          createNodeAndItsApplications(systemKielerGraph, node);
        }

      });

    }

  } // END createNodeGroup

  function createNodeAndItsApplications(kielerParentGraph: kielerGraph, node: Node) {

    const PADDING = 0.1;
    const NODE_LABEL_HEIGHT = 0.2;
    const DEFAULT_WIDTH = 1.5;
    const DEFAULT_HEIGHT = 0.75;

    const nodeKielerGraph = createEmptyGraph(node.get('id'));
    modelIdToGraph.set(node.get('id'), nodeKielerGraph);

    nodeKielerGraph.padding = {
      left: PADDING * CONVERT_TO_KIELER_FACTOR,
      right: PADDING * CONVERT_TO_KIELER_FACTOR,
      top: PADDING * CONVERT_TO_KIELER_FACTOR,
      bottom: 6 * PADDING * CONVERT_TO_KIELER_FACTOR
    };

    const parent = node.get('parent');

    const minWidth = Math.max(DEFAULT_WIDTH *
      CONVERT_TO_KIELER_FACTOR,
      (calculateRequiredLabelLength(getDisplayName(parent, node), NODE_LABEL_HEIGHT) +
        PADDING * 2.0) * CONVERT_TO_KIELER_FACTOR);

    const minHeight = DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;

    if (!nodeKielerGraph.properties || !kielerParentGraph.children)
      return;

    nodeKielerGraph.properties["de.cau.cs.kieler.sizeConstraint"] = "MINIMUM_SIZE";
    nodeKielerGraph.properties["de.cau.cs.kieler.minWidth"] = minWidth;
    nodeKielerGraph.properties["de.cau.cs.kieler.minHeight"] = minHeight;
    nodeKielerGraph.properties["de.cau.cs.kieler.klay.layered.contentAlignment"] = "V_CENTER,H_CENTER";

    kielerParentGraph.children.push(nodeKielerGraph);

    const applications = node.get('applications');

    applications.forEach((application) => {

      const DEFAULT_WIDTH = 1.5;
      const DEFAULT_HEIGHT = 0.75;

      const APPLICATION_PIC_SIZE = 0.16;
      const APPLICATION_PIC_PADDING_SIZE = 0.15;
      const APPLICATION_LABEL_HEIGHT = 0.21;

      application.set('sourcePorts', {});
      application.set('targetPorts', {});

      const width = Math.max(DEFAULT_WIDTH * CONVERT_TO_KIELER_FACTOR,
        (calculateRequiredLabelLength(application.get('name'), APPLICATION_LABEL_HEIGHT) +
          APPLICATION_PIC_PADDING_SIZE + APPLICATION_PIC_SIZE +
          PADDING * 3.0) * CONVERT_TO_KIELER_FACTOR);

      const height = DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;

      const applicationKielerNode = {
        "id": application.get('id'),
        "width": width,
        "height": height,
        "children": [],
        "edges": [],
        "ports": []
      };

      modelIdToGraph.set(application.get('id'), applicationKielerNode);

      if (nodeKielerGraph.children)
        nodeKielerGraph.children.push(applicationKielerNode);
    });

  } // END createNodeAndItsApplications


  function addEdges(landscape: Landscape) {

    const totalApplicationCommunications = landscape.get('totalApplicationCommunications');

    totalApplicationCommunications.forEach((applicationcommunication) => {

      applicationcommunication.set('kielerEdgeReferences', []);
      applicationcommunication.set('points', []);

      let appSource: Application | System = applicationcommunication.
        belongsTo('sourceApplication').value() as Application;
      let appTarget: Application | System = applicationcommunication.
        belongsTo('targetApplication').value() as Application;

      let sourceNode = appSource.belongsTo('parent').value() as Node;
      let sourceNodeGroup = sourceNode.belongsTo('parent').value() as NodeGroup;
      let sourceSystem = sourceNodeGroup.belongsTo('parent').value() as System;

      if (!isVisible(sourceNode)) {
        let maybeSource = isOpen(sourceSystem) ? seekRepresentativeApplication(appSource) : sourceSystem;
        if (maybeSource) appSource = maybeSource;
      }

      let targetNode = appTarget.belongsTo('parent').value() as Node;
      let targetNodeGroup = targetNode.belongsTo('parent').value() as NodeGroup;
      let targetSystem = targetNodeGroup.belongsTo('parent').value() as System;

      if (!isVisible(targetNode)) {
        let maybeTarget = isOpen(targetSystem) ? seekRepresentativeApplication(appTarget) : targetSystem;
        if (maybeTarget) appTarget = maybeTarget;
      }

      if (appSource.id !== appTarget.id) {
        const edge = createEdgeBetweenSourceTarget(appSource, appTarget);
        applicationcommunication.get('kielerEdgeReferences').push(edge);
      }
    });
  } // END addEdges


  function updateGraphWithResults(landscape: Landscape) {

    const systems = landscape.get('systems');

    systems.forEach((system) => {

      updateNodeValues(system);

      const nodegroups = system.get('nodegroups');

      nodegroups.forEach((nodegroup) => {

        if (isVisible(nodegroup)) {

          const nodes = nodegroup.get('nodes');

          if (nodes.get('length') > 1) {
            updateNodeValues(nodegroup);
          }

          setAbsolutePositionForNode(nodegroup, system);

          nodes.forEach((node) => {

            if (isVisible(node)) {

              updateNodeValues(node);

              if (nodes.get('length') > 1) {
                setAbsolutePositionForNode(node, nodegroup);
              } else if (nodes.get('length') === 1) {
                setAbsolutePositionForNode(node, system);
              }

              const applications = node.get('applications');

              applications.forEach((application) => {

                updateNodeValues(application);
                setAbsolutePositionForNode(application, node);

              });

            }

          });

        }

      });

    });

    addBendPointsInAbsoluteCoordinates(landscape);

    systems.forEach((system) => {

      const nodegroups = system.get('nodegroups');

      nodegroups.forEach((nodegroup) => {

        if (isVisible(nodegroup)) {

          const nodes = nodegroup.get('nodes');

          nodes.forEach((node) => {

            if (isVisible(node)) {

              const applications = node.get('applications');

              applications.forEach((application) => {

                convertToExplorVizCoords(application);

              });

              convertToExplorVizCoords(node);

            }

          });

          if (nodes.get('length') > 1) {
            convertToExplorVizCoords(nodegroup);
          }

        }

      });

      convertToExplorVizCoords(system);

    });

  } // END updateGraphWithResults


  function getDisplayName(nodeGroup: NodeGroup, node: Node) {

    if (isOpen(nodeGroup)) {
      if (node.get('name') && node.get('name').length !== 0 && !node.get('name').startsWith("<")) {
        return node.get('name');
      } else {
        return node.get('ipAddress');
      }
    } else {
      return nodeGroup.get('name');
    }
  }


  function convertToExplorVizCoords(entity: any) {

    entity.set('positionX', entity.get('positionX') / CONVERT_TO_KIELER_FACTOR);
    entity.set('positionY', entity.get('positionY') / CONVERT_TO_KIELER_FACTOR);

    entity.set('width', entity.get('width') / CONVERT_TO_KIELER_FACTOR);
    entity.set('height', entity.get('height') / CONVERT_TO_KIELER_FACTOR);


    let layout = modelIdToLayout.get(entity.get('id'));
    if (layout) {
      layout.positionX /= CONVERT_TO_KIELER_FACTOR;
      layout.positionY /= CONVERT_TO_KIELER_FACTOR;
      layout.width /= CONVERT_TO_KIELER_FACTOR;
      layout.height /= CONVERT_TO_KIELER_FACTOR;
    }
  }

  function setAbsolutePositionForNode(child: DrawNodeEntity, parent: DrawNodeEntity) {
    let graph = modelIdToGraph.get(parent.get('id'));

    if (graph && graph.padding) {
      let padding = graph.padding;
      child.set('positionX', parent.get('positionX') + child.get('positionX') + padding.left);
      child.set('positionY', parent.get('positionY') + child.get('positionY') - padding.top);

      let childLayout = modelIdToLayout.get(child.get('id'));
      let parentLayout = modelIdToLayout.get(parent.get('id'));
      let parentGraph = modelIdToGraph.get(parent.get('id'));

      if (childLayout && parentLayout && parentGraph && parentGraph.padding) {
        childLayout.positionX += parentLayout.positionX + parentGraph.padding.left;
        childLayout.positionY += parentLayout.positionY - parentGraph.padding.top;
      }
    }
  }


  function updateNodeValues(entity: DrawNodeEntity) {
    let entityGraph = modelIdToGraph.get(entity.get('id'));
    if (entityGraph && entityGraph.x && entityGraph.y && entityGraph.width && entityGraph.height) {
      let layout = new PlaneLayout();
      layout.positionX = entityGraph.x;
      layout.positionY = entityGraph.y * -1;
      layout.width = entityGraph.width;
      layout.height = entityGraph.height;
      layout.opened = openEntitiesIds.size === 0 ? true : openEntitiesIds.has(entity.get('id'));
      modelIdToLayout.set(entity.get('id'), layout);

      entity.set('positionX', entityGraph.x);

      // KIELER has inverted Y coords
      entity.set('positionY', entityGraph.y * -1);

      entity.set('width', entityGraph.width);
      entity.set('height', entityGraph.height);
    }
  }


  function calculateRequiredLabelLength(text: string, quadSize: number) {

    if (text === null || text === "") {
      return 0;
    }

    return text.length * quadSize;
  }


  function createEdgeBetweenSourceTarget(sourceApplication: DrawNodeEntity, targetApplication: DrawNodeEntity) {

    const port1 = createSourcePortIfNotExisting(sourceApplication);
    const port2 = createTargetPortIfNotExisting(targetApplication);

    let edge = createEdgeHelper(sourceApplication, port1, targetApplication, port2);
    return edge;

    //---------------------------inner functions
    function createSourcePortIfNotExisting(sourceDrawnode: DrawNodeEntity) {

      let ports = sourceDrawnode.get("sourcePorts");

      if (!ports) return;

      const DEFAULT_PORT_WIDTH = 0.000001;

      const DEFAULT_PORT_HEIGHT = 0.000001;

      const CONVERT_TO_KIELER_FACTOR = 180;

      let id = sourceDrawnode.get("id");

      const maybePort = ports[id];

      if (maybePort == null) {

        const length = Object.keys(ports).length;

        const portId = sourceDrawnode.get('id') + "_sp" + (length + 1);

        let port: port = {
          id: portId,
          width: DEFAULT_PORT_WIDTH * CONVERT_TO_KIELER_FACTOR,
          height: DEFAULT_PORT_HEIGHT * CONVERT_TO_KIELER_FACTOR,
          properties: {
            "de.cau.cs.kieler.portSide": "EAST"
          },
          x: 0,
          y: 0
        };


        let sourceGraph = modelIdToGraph.get(sourceDrawnode.get('id'));
        port.node = sourceGraph;

        sourceGraph?.ports?.push(port);

        ports[id] = port;
      }

      return ports[sourceDrawnode.get('id')];
    }


    function createTargetPortIfNotExisting(targetDrawnode: DrawNodeEntity) {

      let ports = targetDrawnode.get("targetPorts");

      const DEFAULT_PORT_WIDTH = 0.000001;

      const DEFAULT_PORT_HEIGHT = 0.000001;

      const CONVERT_TO_KIELER_FACTOR = 180;

      let id = targetDrawnode.get("id");

      const maybePort = ports[id];

      if (maybePort == null) {

        const length = Object.keys(ports).length;

        const portId = targetDrawnode.get('id') + "_tp" + (length + 1);

        let port: port = {
          id: portId,
          width: DEFAULT_PORT_WIDTH * CONVERT_TO_KIELER_FACTOR,
          height: DEFAULT_PORT_HEIGHT * CONVERT_TO_KIELER_FACTOR,
          properties: {
            "de.cau.cs.kieler.portSide": "WEST"
          },
          x: 0,
          y: 0
        };

        let targetGraph = modelIdToGraph.get(targetDrawnode.get('id'));
        if (!targetGraph) {
          return;
        }

        port.node = targetGraph;

        targetGraph?.ports?.push(port);

        ports[targetDrawnode.get('id')] = port;
      }

      return ports[targetDrawnode.get('id')];
    }

    //---------------------------- end inner functions

  } // END createEdgeBetweenSourceTarget

  function createEdgeHelper(sourceDrawnode: DrawNodeEntity, port1: port, targetDrawnode: DrawNodeEntity, port2: port) {

    const id = sourceDrawnode.get('id') + "_to_" + targetDrawnode.get('id');

    let edge = lookForExistingEdge(sourceDrawnode, id);

    if (edge) {
      return edge;
    }

    edge = createNewEdge(id);

    setEdgeLayoutProperties(edge);

    edge.source = sourceDrawnode.get('id');
    edge.target = targetDrawnode.get('id');

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

    let graph = modelIdToGraph.get(sourceDrawnode.get('id'));
    graph?.edges?.push(edge);

    return edge;


    //inner function
    // looks for already existing edges
    function lookForExistingEdge(sourceDrawnode: DrawNodeEntity, id: string) {
      let edges = modelIdToGraph.get(sourceDrawnode.get('id'))?.edges;
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

  function createNewEdge(id: string) {
    const kielerEdge = {
      id: id
    };
    return kielerEdge;
  }

  function setEdgeLayoutProperties(edge: edge) {
    const lineThickness = 0.06 * 4.0 + 0.01;
    const oldThickness = edge.thickness ? edge.thickness : 0.0;
    edge.thickness = Math.max(lineThickness * CONVERT_TO_KIELER_FACTOR, oldThickness);
  }

  function addBendPointsInAbsoluteCoordinates(landscape: Landscape) {

    const totalApplicationCommunications = landscape.get('totalApplicationCommunications');
    const alreadyCalculatedPoints = {};

    totalApplicationCommunications.forEach((applicationcommunication) => {

      const kielerEdgeReferences: edge[] = applicationcommunication.get('kielerEdgeReferences');

      kielerEdgeReferences.forEach((edge: edge) => {
        if (edge != null) {

          if (alreadyCalculatedPoints[edge.id]) {
            applicationcommunication.set('points', alreadyCalculatedPoints[edge.id]);
            return;
          }

          let sourceApplication = applicationcommunication.belongsTo('sourceApplication').value() as Application;
          let targetApplication = applicationcommunication.belongsTo('targetApplication').value() as Application;
          let parentNode = getRightParent(sourceApplication, targetApplication);

          var points = [];

          var edgeOffset: padding = { bottom: 0.0, left: 0.0, right: 0.0, top: 0.0 };

          if (parentNode != null) {

            points = edge.bendPoints ? edge.bendPoints : [];

            edgeOffset = { bottom: 0.0, left: 0.0, right: 0.0, top: 0.0 };

            let parentGraph = modelIdToGraph.get(parentNode.get('id'));
            if (parentGraph && parentGraph.padding) {
              edgeOffset = parentGraph.padding;
            }

            var sourcePoint = null;

            if (isDescendant(edge.targetNode, edge.sourceNode)) {

              // self edges..
              let sourcePort = edge.sPort;

              sourcePoint = {
                x: sourcePort.x,
                y: sourcePort.y
              };

              let sourceGraph = modelIdToGraph.get(edge.sourceNode.get('id'));
              let sourceInsets = sourceGraph.padding;

              sourcePoint.x -= sourceInsets.left;
              sourcePoint.y -= sourceInsets.top;

              let nestedGraph = sourceGraph;

              if (nestedGraph != null) {
                edgeOffset = nestedGraph.padding;
              }
            }
            else {

              if (edge.source) {
                sourcePoint = {
                  x: edge.sourcePoint.x,
                  y: edge.sourcePoint.y
                };
              } else {
                sourcePoint = {
                  x: edge.sPort.x,
                  y: edge.sPort.y
                };
              }

            }

            points.unshift(sourcePoint);

            var targetPoint = edge.targetPoint ? {
              x: edge.targetPoint.x,
              y: edge.targetPoint.y
            } : {
                x: edge.tPort.x,
                y: edge.tPort.y
              };

            let targetGraph = modelIdToGraph.get(edge.targetNode.get('id'));

            if (targetGraph.padding) {
              targetPoint.x += targetGraph.padding.left;
              targetPoint.y += targetGraph.padding.top;
            }

            points.push(targetPoint);

            points.forEach((point) => {
              point.x += edgeOffset.left;
              point.y += edgeOffset.top;
            });


            let pOffsetX = 0.0;
            let pOffsetY = 0.0;

            if (parentNode) {
              let insetLeft = 0.0;
              let insetTop = 0.0;

              // why is parentNode.constructor.modelName undefined?
              // "alternative": parentNode.content._internalModel.modelName
              if (parentNode instanceof System) {
                pOffsetX = insetLeft;
                pOffsetY = insetTop * -1;
              } else {
                pOffsetX = parentNode.get('positionX') + insetLeft;
                pOffsetY = parentNode.get('positionY') - insetTop;

              }
            }

            let updatedPoints: point[] = [];
            points.forEach((point) => {
              let resultPoint = {
                x: 0,
                y: 0
              };

              resultPoint.x = (point.x + pOffsetX) / CONVERT_TO_KIELER_FACTOR;
              resultPoint.y = (point.y * -1 + pOffsetY) / CONVERT_TO_KIELER_FACTOR; // KIELER has inverted Y coords
              applicationcommunication.get('points').push(resultPoint);
              updatedPoints.push(resultPoint);

            });

            alreadyCalculatedPoints[edge.id] = updatedPoints;

          } // END if (parentNode != null)
        }
      });
    });
  } // END addBendPoints

  function isDescendant(child: DrawNodeEntity, parent: DrawNodeEntity) {

    let current = child;
    let next = child.get('parent');

    while (next) {
      current = next;
      if (current === parent) {
        return true;
      }
      next = current.get('parent');
    }

    return false;
  }

  function getRightParent(sourceApplication: Application, targetApplication: Application): System | Node | null {
    let sourceNode = sourceApplication.belongsTo('parent').value() as Node;

    let result: System | Node | null = sourceNode;

    if (!isVisible(sourceNode)) {
      let sourceNodeGroup = sourceNode.belongsTo('parent').value() as NodeGroup;
      let sourceSystem = sourceNodeGroup.belongsTo('parent').value() as System;

      let targetNode = targetApplication.belongsTo('parent').value() as Node;
      let targetNodeGroup = targetNode.belongsTo('parent').value() as NodeGroup;
      let targetSystem = targetNodeGroup.belongsTo('parent').value() as System;

      if (!isOpen(sourceSystem)) {
        if (sourceSystem !== targetSystem) {
          result = sourceSystem;
        } else {
          result = null; // means don't draw
        }
      } else {
        let maybeApp = seekRepresentativeApplication(sourceApplication);
        if (maybeApp) {
          result = maybeApp.belongsTo('parent').value() as Node;
        }
      }
    }
    return result;
  }


  /**
   * Searches for an application with the same name as the 
   * given application within the same nodegroup. This can be
   * be done because a nodegroup only contains nodes which run
   * the same applications.
   * @param application 
   */
  function seekRepresentativeApplication(application: Application): Application | null {
    let parentNode = application.belongsTo('parent').value() as Node;
    let parentNodeGroup = parentNode.belongsTo('parent').value() as NodeGroup;

    let nodes = parentNodeGroup.hasMany('nodes').value() as DS.ManyArray<Node>;

    let returnValue = null;

    nodes.forEach((node) => {
      if (isVisible(node)) {

        const applications = node.get('applications');

        applications.forEach((representiveApplication) => {

          if (representiveApplication.get('name') === application.get('name')) {
            returnValue = representiveApplication;
          }
        });
      }
    });

    return returnValue;
  }

  function isOpen(system: System): boolean;
  function isOpen(nodeGroup: NodeGroup): boolean;

  function isOpen(entity: System | NodeGroup) {
    if (openEntitiesIds.size === 0) {
      return true;
    }
    if (entity instanceof System) {
      return openEntitiesIds.has(entity.get('id'));
    } else if (entity instanceof NodeGroup) {
      return entity.get("nodes").length < 2 || openEntitiesIds.has(entity.get('id'));
    }
    // TODO: Check why this can happen
    return openEntitiesIds.has(entity.get('id'));
  }

  function isVisible(application: Application): boolean;
  function isVisible(node: Node): boolean;
  function isVisible(nodeGroup: NodeGroup): boolean;

  function isVisible(entity: Application | Node | NodeGroup) {
    if (entity instanceof NodeGroup) {
      let system = entity.belongsTo('parent').value() as System;
      return isOpen(system);
    } else if (entity instanceof Node) {
      let nodeGroup = entity.belongsTo('parent').value() as NodeGroup;
      if (isOpen(nodeGroup)) {
        return isVisible(nodeGroup);
      } else {
        let nodes = nodeGroup.hasMany('nodes').value() as DS.ManyArray<Node>;
        return nodes.objectAt(0)?.get('id') === entity.get('id') && isVisible(nodeGroup);
      }
    } else if (entity instanceof Application) {
      let node = entity.belongsTo('parent').value() as Node;
      return isVisible(node);
    } else {
      return false;
    }
  }
}
