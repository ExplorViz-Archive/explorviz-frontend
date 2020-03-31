import PlaneLayout from "explorviz-frontend/view-objects/layout-models/plane-layout";
import { ReducedLandscape, ReducedSystem, ReducedApplication, ReducedNodeGroup, ReducedNode } from "./model-reducer";

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
  id: string;
  thickness?: number;
  sourcePoint?: point;
  targetPoint?: point;
  bendPoints?: point[];
  source?: string;
  target?: string;
  sourceNode?: any;
  targetNode?: any;
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

export default function applyKlayLayout(landscape: ReducedLandscape, openEntitiesIds: Set<string>) {

  let topLevelKielerGraph: kielerGraph = {};

  const CONVERT_TO_KIELER_FACTOR = 180.0;

  // Maps for internal computations
  let modelIdToGraph: Map<string, kielerGraph> = new Map();
  let modelIdToSourcePort: Map<string, port> = new Map();
  let modelIdToTargetPort: Map<string, port> = new Map();
  let modeldToKielerEdgeReference: Map<string, any> = new Map();

  // Maps for output
  let modelIdToLayout: Map<string, PlaneLayout> = new Map();
  let modelIdToPoints: Map<string, point[]> = new Map();

  setupKieler(landscape);
  updateGraphWithResults(landscape);

  return {modelIdToLayout, modelIdToPoints};

  // Functions

  function setupKieler(landscape: ReducedLandscape) {

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


  function addNodes(landscape: ReducedLandscape) {
    const systems = landscape.systems;

    if (systems) {

      systems.forEach((system) => {

        const DEFAULT_WIDTH = 1.5;
        const DEFAULT_HEIGHT = 0.75;

        const PADDING = 0.1;
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

          systemKielerGraph.properties["de.cau.cs.kieler.sizeConstraint"] = "MINIMUM_SIZE";
          systemKielerGraph.properties["de.cau.cs.kieler.minWidth"] = minWidth;
          systemKielerGraph.properties["de.cau.cs.kieler.minHeight"] = minHeight;
          systemKielerGraph.properties["de.cau.cs.kieler.klay.layered.contentAlignment"] = "V_CENTER, H_CENTER";

          systemKielerGraph.padding = {
            left: PADDING * CONVERT_TO_KIELER_FACTOR,
            right: PADDING * CONVERT_TO_KIELER_FACTOR,
            // Leave space for system label
            top: 8 * PADDING * CONVERT_TO_KIELER_FACTOR,
            bottom: PADDING * CONVERT_TO_KIELER_FACTOR
          };

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

          const systemKielerNode: kielerGraph = {
            "id": system.id,
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

          modelIdToGraph.set(system.id, systemKielerNode);

          if (!topLevelKielerGraph.children)
            return;
          topLevelKielerGraph.children.push(systemKielerNode);

        }
      });
    }

  } // END addNodes

  function createNodeGroup(systemKielerGraph: kielerGraph, nodegroup: ReducedNodeGroup) {

    const nodes = nodegroup.nodes;
    const PADDING = 0.1;

    if (nodes.length > 1) {

      const nodeGroupKielerGraph = createEmptyGraph(nodegroup.id);
      modelIdToGraph.set(nodegroup.id, nodeGroupKielerGraph);

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

  function createNodeAndItsApplications(kielerParentGraph: kielerGraph, node: ReducedNode) {

    const PADDING = 0.1;
    const NODE_LABEL_HEIGHT = 0.2;
    const DEFAULT_WIDTH = 1.5;
    const DEFAULT_HEIGHT = 0.75;

    const nodeKielerGraph = createEmptyGraph(node.id);
    modelIdToGraph.set(node.id, nodeKielerGraph);

    nodeKielerGraph.padding = {
      left: PADDING * CONVERT_TO_KIELER_FACTOR,
      right: PADDING * CONVERT_TO_KIELER_FACTOR,
      top: PADDING * CONVERT_TO_KIELER_FACTOR,
      bottom: 6 * PADDING * CONVERT_TO_KIELER_FACTOR
    };

    const parent = node.parent as ReducedNodeGroup;

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


  function addEdges(landscape: ReducedLandscape) {

    const totalApplicationCommunications = landscape.applicationCommunications;

    totalApplicationCommunications.forEach((applicationcommunication) => {

      modeldToKielerEdgeReference.set(applicationcommunication.id, []);

      modelIdToPoints.set(applicationcommunication.id, []);

      let appSource: ReducedApplication | ReducedSystem = applicationcommunication.sourceApplication;
      let appTarget: ReducedApplication | ReducedSystem = applicationcommunication.targetApplication;

      let sourceNode = appSource.parent as ReducedNode;
      let sourceNodeGroup = sourceNode.parent as ReducedNodeGroup;
      let sourceSystem = sourceNodeGroup.parent as ReducedSystem;

      if (!isVisible(sourceNode)) {
        let maybeSource = isOpen(sourceSystem) ? seekRepresentativeApplication(appSource) : sourceSystem;
        if (maybeSource) appSource = maybeSource;
      }

      let targetNode = appTarget.parent as ReducedNode;
      let targetNodeGroup = targetNode.parent as ReducedNodeGroup;
      let targetSystem = targetNodeGroup.parent as ReducedSystem;

      if (!isVisible(targetNode)) {
        let maybeTarget = isOpen(targetSystem) ? seekRepresentativeApplication(appTarget) : targetSystem;
        if (maybeTarget) appTarget = maybeTarget;
      }

      if (appSource.id !== appTarget.id) {
        const edge = createEdgeBetweenSourceTarget(appSource, appTarget);
        let edgeReference = modeldToKielerEdgeReference.get(applicationcommunication.id);
        edgeReference.push(edge);
      }
    });
  } // END addEdges


  function updateGraphWithResults(landscape: ReducedLandscape) {

    const systems = landscape.systems;

    systems.forEach((system) => {

      updateNodeValues(system);

      const nodegroups = system.nodeGroups;

      nodegroups.forEach((nodegroup) => {

        if (isVisible(nodegroup)) {

          const nodes = nodegroup.nodes;

          if (nodes.length > 1) {
            updateNodeValues(nodegroup);
          }

          setAbsolutePositionForNode(nodegroup, system);

          nodes.forEach((node) => {

            if (isVisible(node)) {

              updateNodeValues(node);

              if (nodes.length > 1) {
                setAbsolutePositionForNode(node, nodegroup);
              } else if (nodes.length === 1) {
                setAbsolutePositionForNode(node, system);
              }

              const applications = node.applications;

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

      const nodegroups = system.nodeGroups;

      nodegroups.forEach((nodegroup) => {

        if (isVisible(nodegroup)) {

          const nodes = nodegroup.nodes;

          nodes.forEach((node) => {

            if (isVisible(node)) {

              const applications = node.applications;

              applications.forEach((application) => {

                convertToExplorVizCoords(application);

              });

              convertToExplorVizCoords(node);

            }

          });

          if (nodes.length > 1) {
            convertToExplorVizCoords(nodegroup);
          }

        }

      });

      convertToExplorVizCoords(system);

    });

  } // END updateGraphWithResults


  function getDisplayName(nodeGroup: ReducedNodeGroup, node: ReducedNode) {

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


  function convertToExplorVizCoords(entity: any) {
    let layout = modelIdToLayout.get(entity.id);
    if (layout) {
      layout.positionX /= CONVERT_TO_KIELER_FACTOR;
      layout.positionY /= CONVERT_TO_KIELER_FACTOR;
      layout.width /= CONVERT_TO_KIELER_FACTOR;
      layout.height /= CONVERT_TO_KIELER_FACTOR;
    }
  }

  function setAbsolutePositionForNode(child: any, parent: any) {
    let childLayout = modelIdToLayout.get(child.id);
    let parentLayout = modelIdToLayout.get(parent.id);
    let parentGraph = modelIdToGraph.get(parent.id);

    if (childLayout && parentLayout && parentGraph && parentGraph.padding) {
      childLayout.positionX += parentLayout.positionX + parentGraph.padding.left;
      childLayout.positionY += parentLayout.positionY - parentGraph.padding.top;
    }
  }


  function updateNodeValues(entity: any) {
    let entityGraph = modelIdToGraph.get(entity.id);
    if (entityGraph && entityGraph.x && entityGraph.y && entityGraph.width && entityGraph.height) {
      let layout = new PlaneLayout();
      layout.positionX = entityGraph.x;
      layout.positionY = entityGraph.y * -1;
      layout.width = entityGraph.width;
      layout.height = entityGraph.height;
      layout.opened = openEntitiesIds.size === 0 ? true : openEntitiesIds.has(entity.id);
      modelIdToLayout.set(entity.id, layout);
    }
  }


  function calculateRequiredLabelLength(text: string, quadSize: number) {

    if (text === null || text === "") {
      return 0;
    }

    return text.length * quadSize;
  }


  function createEdgeBetweenSourceTarget(sourceApplication: any, targetApplication: any) {

    const port1 = createSourcePortIfNotExisting(sourceApplication);
    const port2 = createTargetPortIfNotExisting(targetApplication);

    let edge = createEdgeHelper(sourceApplication, port1, targetApplication, port2);
    return edge;

    //---------------------------inner functions
    function createSourcePortIfNotExisting(sourceDrawnode: any) {

      // Do not create duplicate port
      let maybePort = modelIdToSourcePort.get(sourceDrawnode.id);
      if (maybePort && modelIdToSourcePort.has(sourceDrawnode.id)){
        return maybePort;
      } else {
        const DEFAULT_PORT_WIDTH = 0.000001;

        const DEFAULT_PORT_HEIGHT = 0.000001;
  
        const CONVERT_TO_KIELER_FACTOR = 180;

        const portId = sourceDrawnode.id + "_sp1";

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

        let sourceGraph = modelIdToGraph.get(sourceDrawnode.id);
        port.node = sourceGraph;

        modelIdToSourcePort.set(sourceDrawnode.id, port);
        sourceGraph?.ports?.push(port);

        return port;
      }
    }


    function createTargetPortIfNotExisting(targetDrawnode: any) {

      // Do not create duplicate port
      let maybePort = modelIdToTargetPort.get(targetDrawnode.id);
      if (maybePort && modelIdToTargetPort.has(targetDrawnode.id)){
        return maybePort;
      } else {
        const DEFAULT_PORT_WIDTH = 0.000001;

        const DEFAULT_PORT_HEIGHT = 0.000001;
  
        const CONVERT_TO_KIELER_FACTOR = 180;

        const portId = targetDrawnode.id + "_tp1";

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

        let targetGraph = modelIdToGraph.get(targetDrawnode.id);
        port.node = targetGraph;

        modelIdToTargetPort.set(targetDrawnode.id, port);
        targetGraph?.ports?.push(port);

        return port;
      }
    }

    //---------------------------- end inner functions

  } // END createEdgeBetweenSourceTarget

  function createEdgeHelper(sourceDrawnode: any, port1: port, targetDrawnode: any, port2: port) {

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

    let graph = modelIdToGraph.get(sourceDrawnode.id);
    graph?.edges?.push(edge);

    return edge;


    //inner function
    // looks for already existing edges
    function lookForExistingEdge(sourceDrawnode: any, id: string) {
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

  function addBendPointsInAbsoluteCoordinates(landscape: ReducedLandscape) {

    const totalApplicationCommunications = landscape.applicationCommunications;
    // Points for drawing which represent an edge
    const edgeIdToPoints: Map<string, point[]> = new Map();

    totalApplicationCommunications.forEach((applicationcommunication) => {

      const kielerEdgeReferences: edge[] = modeldToKielerEdgeReference.get(applicationcommunication.id);

      kielerEdgeReferences.forEach((edge: edge) => {
        if (edge != null) {

          let maybePoints = edgeIdToPoints.get(edge.id);
          if (maybePoints) {
            modelIdToPoints.set(applicationcommunication.id, maybePoints);
            return;
          }

          let sourceApplication = applicationcommunication.sourceApplication as ReducedApplication;
          let targetApplication = applicationcommunication.targetApplication as ReducedApplication;
          let parentNode = getRightParent(sourceApplication, targetApplication);

          var points = [];

          var edgeOffset: padding = { bottom: 0.0, left: 0.0, right: 0.0, top: 0.0 };

          if (parentNode) {

            points = edge.bendPoints ? edge.bendPoints : [];

            edgeOffset = { bottom: 0.0, left: 0.0, right: 0.0, top: 0.0 };

            // @ts-ignore Since overlapping id property is not detected
            let parentGraph = modelIdToGraph.get(parentNode.id);
            if (parentGraph && parentGraph.padding) {
              edgeOffset = parentGraph.padding;
            }

            var sourcePoint = null;

            if (isDescendant(edge.targetNode, edge.sourceNode)) {

              // Self edges..
              let sourcePort = edge.sPort;

              if (!sourcePort?.x || !sourcePort.y) return;

              sourcePoint = {
                x: sourcePort.x,
                y: sourcePort.y
              };

              let sourceGraph = modelIdToGraph.get(edge.sourceNode.id);

              if (!sourceGraph) return;

              let sourceInsets = sourceGraph.padding;

              if (sourcePoint.x && sourcePoint.y &&
                sourceInsets?.left && sourceInsets.top){
                  sourcePoint.x -= sourceInsets.left;
                  sourcePoint.y -= sourceInsets.top;
              }


              let nestedGraph = sourceGraph;

              if (nestedGraph?.padding) {
                edgeOffset = nestedGraph.padding;
              }
            }
            else {

              if (edge.source && edge?.sourcePoint) {
                sourcePoint = {
                  x: edge.sourcePoint.x,
                  y: edge.sourcePoint.y
                };
              } else if (edge.sPort?.x && edge.sPort.y){
                sourcePoint = {
                  x: edge.sPort.x,
                  y: edge.sPort.y
                };
              } else {
                return;
              }

            }

            points.unshift(sourcePoint);

            if (!edge.tPort?.x || !edge.tPort.y) return;

            let targetPoint = edge.targetPoint ? {
              x: edge.targetPoint.x,
              y: edge.targetPoint.y
            } : {
                x: edge.tPort.x,
                y: edge.tPort.y
              }

            let targetGraph = modelIdToGraph.get(edge.targetNode.id);

            if (targetGraph?.padding && targetPoint?.x && targetPoint.y) {
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
              if (isReducedSystem(parentNode)) {
                pOffsetX = insetLeft;
                pOffsetY = insetTop * -1;
              } else {
                let layout = modelIdToLayout.get(parentNode.id);
                if (layout){
                  pOffsetX = layout?.positionX + insetLeft;
                  pOffsetY = layout?.positionY - insetTop;
                }
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
              let points = modelIdToPoints.get(applicationcommunication.id);
              if (points){
                points.push(resultPoint);
                modelIdToPoints.set(applicationcommunication.id, points);
              }
              updatedPoints.push(resultPoint);

            });

            edgeIdToPoints.set(edge.id, updatedPoints);

          } // END if (parentNode != null)
        }
      });
    });
  } // END addBendPoints

  function isDescendant(child: any, parent: any) {

    let current = child;
    let next = child.parent;

    while (next) {
      current = next;
      if (current === parent) {
        return true;
      }
      next = current.parent;
    }

    return false;
  }

  function getRightParent(sourceApplication: ReducedApplication, targetApplication: ReducedApplication): ReducedSystem | ReducedNode | null {
    let sourceNode = sourceApplication.parent as ReducedNode;

    let result: ReducedSystem | ReducedNode | null = sourceNode;

    if (!isVisible(sourceNode)) {
      let sourceNodeGroup = sourceNode.parent as ReducedNodeGroup;
      let sourceSystem = sourceNodeGroup.parent as ReducedSystem;

      let targetNode = targetApplication.parent as ReducedNode;
      let targetNodeGroup = targetNode.parent as ReducedNodeGroup;
      let targetSystem = targetNodeGroup.parent as ReducedSystem;

      if (!isOpen(sourceSystem)) {
        if (sourceSystem !== targetSystem) {
          result = sourceSystem;
        } else {
          result = null; // means don't draw
        }
      } else {
        let maybeApp = seekRepresentativeApplication(sourceApplication);
        if (maybeApp) {
          result = maybeApp.parent as ReducedNode;
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
  function seekRepresentativeApplication(application: ReducedApplication): ReducedApplication | null {
    let parentNode = application.parent as ReducedNode;
    let parentNodeGroup = parentNode.parent as ReducedNodeGroup;

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

  function isOpen(system: ReducedSystem): boolean;
  function isOpen(nodeGroup: ReducedNodeGroup): boolean;

  function isOpen(entity: ReducedSystem | ReducedNodeGroup) {
    if (openEntitiesIds.size === 0) {
      return true;
    }
    
    if (isReducedNodeGroup(entity)) {
      return entity.nodes.length < 2 || openEntitiesIds.has(entity.id);
    } else {
      return openEntitiesIds.has(entity.id);
    }
  }

  function isVisible(application: ReducedApplication): boolean;
  function isVisible(node: ReducedNode): boolean;
  function isVisible(nodeGroup: ReducedNodeGroup): boolean;

  function isVisible(entity: ReducedApplication | ReducedNode | ReducedNodeGroup) {
    if (isReducedNodeGroup(entity)) {
      let system = entity.parent as ReducedSystem;
      return isOpen(system);
    } else if (isReducedNode(entity)) {
      let nodeGroup = entity.parent as ReducedNodeGroup;
      if (isOpen(nodeGroup)) {
        return isVisible(nodeGroup);
      } else {
        let nodes = nodeGroup.nodes;
        return nodes[0]?.id === entity.id && isVisible(nodeGroup);
      }
    } else if (isReducedApplication(entity)) {
      let node = entity.parent as ReducedNode;
      return isVisible(node);
    } else {
      return false;
    }
  }

  function isReducedSystem(arg: any): arg is ReducedSystem {
    return arg.nodeGroups !== undefined;
  }

  function isReducedNodeGroup(arg: any): arg is ReducedNodeGroup {
    return arg.nodes !== undefined;
  }

  function isReducedNode(arg: any): arg is ReducedNode {
    return arg.applications !== undefined;
  }

  function isReducedApplication(arg: any): arg is ReducedApplication {
    return arg.type !== undefined && arg.type === 'application';
  }
}
