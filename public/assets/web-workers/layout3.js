// Wait for the initial message event.
self.addEventListener('message', function(e) {
  let { reducedLandscape, openEntitiesIds, modelIdToPoints, graph } = e.data;

  let landscape = layout3(reducedLandscape, openEntitiesIds, modelIdToPoints, graph);
  postMessage(landscape);
}, false);

const CONVERT_TO_KIELER_FACTOR = 180.0;

function layout3(landscape, openEntitiesIds, modelIdToPoints, graph) {

  let modelIdToGraph = new Map();
  let modeldToKielerEdgeReference = new Map();

  // Maps for output
  let modelIdToLayout = new Map();

  createModelIdToGraphMap(graph);
  createModelIdToEdgeMap();

  updateGraphWithResults(landscape); 

  return { modelIdToLayout, modelIdToPoints, modeldToKielerEdgeReference, modelIdToGraph, graph };

  function createModelIdToGraphMap(kielerGraph) {
    if(kielerGraph.id !== 'root') {
      modelIdToGraph.set(kielerGraph.id, kielerGraph);
    }
    kielerGraph.children?.forEach((childGraph) => {
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


  function updateGraphWithResults(landscape) {

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

  function addBendPointsInAbsoluteCoordinates(landscape) {

    const totalApplicationCommunications = landscape.applicationCommunications;
    // Points for drawing which represent an edge
    const edgeIdToPoints = new Map();

    totalApplicationCommunications?.forEach((applicationcommunication) => {

      const kielerEdgeReferences = modeldToKielerEdgeReference.get(applicationcommunication.id);

      kielerEdgeReferences?.forEach((edge) => {
        if (edge != null) {

          let maybePoints = edgeIdToPoints.get(edge.id);
          if (maybePoints) {
            modelIdToPoints.set(applicationcommunication.id, maybePoints);
            return;
          }

          let sourceApplication = applicationcommunication.sourceApplication;
          let targetApplication = applicationcommunication.targetApplication;
          let parentNode = getRightParent(sourceApplication, targetApplication);

          if (parentNode) {

            let points = [];

            if (edge.sections && edge.sections[0]?.bendPoints) {
              points = edge.sections[0]?.bendPoints;
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
            }
            else {

              if (edge.source && edge.sections && edge.sections[0]?.startPoint) {
                sourcePoint = {
                  x: edge.sections[0].startPoint.x,
                  y: edge.sections[0].startPoint.y
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

            let targetPoint = (edge.sections && edge.sections[0]?.endPoint) ? {
              x: edge.sections[0].endPoint.x,
              y: edge.sections[0].endPoint.y
            } : {
                x: edge.tPort.x,
                y: edge.tPort.y
              }

            points.push(targetPoint);

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

            let updatedPoints = [];
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

  function updateNodeValues(entity) {
    let entityGraph = modelIdToGraph.get(entity.id);
    if (entityGraph && entityGraph.x && entityGraph.y && entityGraph.width && entityGraph.height) {
      let layout = {
        positionX: entityGraph.x,
        positionY: entityGraph.y * -1,
        width: entityGraph.width,
        height: entityGraph.height,
        opened: openEntitiesIds.has(entity.id)
      }
      modelIdToLayout.set(entity.id, layout);
    }
  }

  function convertToExplorVizCoords(entity) {
    let layout = modelIdToLayout.get(entity.id);
    if (layout) {
      layout.positionX /= CONVERT_TO_KIELER_FACTOR;
      layout.positionY /= CONVERT_TO_KIELER_FACTOR;
      layout.width /= CONVERT_TO_KIELER_FACTOR;
      layout.height /= CONVERT_TO_KIELER_FACTOR;
    }
  }

  function setAbsolutePositionForNode(child, parent) {
    let childLayout = modelIdToLayout.get(child.id);
    let parentLayout = modelIdToLayout.get(parent.id);
    let parentGraph = modelIdToGraph.get(parent.id);

    if (childLayout && parentLayout) {
      childLayout.positionX += parentLayout.positionX;
      childLayout.positionY += parentLayout.positionY;
    }
  }

  function getRightParent(sourceApplication, targetApplication) {
    let sourceNode = sourceApplication.parent;

    let result = sourceNode;

    if (!isVisible(sourceNode)) {
      let sourceNodeGroup = sourceNode.parent;
      let sourceSystem = sourceNodeGroup.parent;

      let targetNode = targetApplication.parent;
      let targetNodeGroup = targetNode.parent;
      let targetSystem = targetNodeGroup.parent;

      if (!isOpen(sourceSystem)) {
        if (sourceSystem !== targetSystem) {
          result = sourceSystem;
        } else {
          result = null; // means don't draw
        }
      } else {
        let maybeApp = seekRepresentativeApplication(sourceApplication);
        if (maybeApp) {
          result = maybeApp.parent;
        }
      }
    }
    return result;
  }

  function isDescendant(child, parent) {

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
  function seekRepresentativeApplication(application) {
    let parentNode = application.parent;
    let parentNodeGroup = parentNode.parent;

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

  function isReducedSystem(arg) {
    return arg.nodeGroups !== undefined;
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