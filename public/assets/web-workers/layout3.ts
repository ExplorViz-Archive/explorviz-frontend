// Wait for the initial message event.
self.addEventListener('message', function(e) {
  let { reducedLandscape, openEntitiesIds, modelIdToPoints, graph }: any = e.data;
  let port = e.ports[0];
  
  // Do your stuff here.
  if (port) {
    // Message sent through a worker created with 'open' method.
    port.postMessage({ foo: 'foo' });
  } else {
    // Message sent through a worker created with 'send' or 'on' method.
    let landscape = layout3(reducedLandscape, openEntitiesIds, modelIdToPoints, graph);
    postMessage(landscape); 
  }
}, false);

const CONVERT_TO_KIELER_FACTOR = 180.0;

function layout3(landscape: ReducedLandscape,
  openEntitiesIds: Set<string>, modelIdToPoints: Map<string, Point[]>, graph: kielerGraph) {

  let modelIdToGraph: Map<string, kielerGraph> = new Map();
  let modeldToKielerEdgeReference: Map<string, any> = new Map();

  // Maps for output
  let modelIdToLayout: Map<string, PlaneLayout> = new Map();

  createModelIdToGraphMap(graph);
  createModelIdToEdgeMap();

  updateGraphWithResults(landscape); 

  return { modelIdToLayout, modelIdToPoints, modeldToKielerEdgeReference, modelIdToGraph, graph };

  function createModelIdToGraphMap(graf: kielerGraph) {
    if(graf.id !== 'root') {
      modelIdToGraph.set(graf.id, graf);
    }
    graf.children?.forEach((childGraph) => {
      createModelIdToGraphMap(childGraph);
    });
  }

  function createModelIdToEdgeMap() {
    modelIdToGraph?.forEach((kielerGraph) => {
      kielerGraph.edges?.forEach((edge) => {
        if(edge.communicationId)
          modeldToKielerEdgeReference.set(edge.communicationId, [edge]);
      })
    })
  }


  function updateGraphWithResults(landscape: ReducedLandscape) {

    const systems = landscape.systems;

    systems?.forEach((system) => {

      updateNodeValues(system);

      const nodegroups = system.nodeGroups;

      nodegroups?.forEach((nodegroup) => {

        if (isVisible(nodegroup)) {

          const nodes = nodegroup.nodes;

          if (nodes.length > 1) {
            updateNodeValues(nodegroup);
          }

          setAbsolutePositionForNode(nodegroup, system);

          nodes?.forEach((node) => {

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

    systems?.forEach((system) => {

      const nodegroups = system.nodeGroups;

      nodegroups?.forEach((nodegroup) => {

        if (isVisible(nodegroup)) {

          const nodes = nodegroup.nodes;

          nodes?.forEach((node) => {

            if (isVisible(node)) {

              const applications = node.applications;

              applications?.forEach((application) => {

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

  function addBendPointsInAbsoluteCoordinates(landscape: ReducedLandscape) {

    const totalApplicationCommunications = landscape.applicationCommunications;
    // Points for drawing which represent an edge
    const edgeIdToPoints: Map<string, Point[]> = new Map();

    totalApplicationCommunications?.forEach((applicationcommunication) => {

      const kielerEdgeReferences: edge[] = modeldToKielerEdgeReference.get(applicationcommunication.id);

      kielerEdgeReferences?.forEach((edge: edge) => {
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

            points?.forEach((point) => {
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

            let updatedPoints: Point[] = [];
            points?.forEach((point) => {
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

  function updateNodeValues(entity: any) {
    let entityGraph = modelIdToGraph.get(entity.id);
    if (entityGraph && entityGraph.x && entityGraph.y && entityGraph.width && entityGraph.height) {
      let layout = {
        positionX: entityGraph.x,
        positionY: entityGraph.y * -1,
        width: entityGraph.width,
        height: entityGraph.height,
        opened: openEntitiesIds.size === 0 ? true : openEntitiesIds.has(entity.id)
      }
      modelIdToLayout.set(entity.id, layout);
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

    nodes?.forEach((node) => {
      if (isVisible(node)) {

        const applications = node.applications;

        applications?.forEach((representiveApplication) => {

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