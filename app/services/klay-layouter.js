import Ember from 'ember';

export default Ember.Service.extend({

  topLevelKielerGraph: null,

  CONVERT_TO_KIELER_FACTOR: 180.0,

  applyLayout(landscape) {

    const self = this;

    setupKieler(landscape);

    updateGraphWithResults(landscape);


    // Functions

    function setupKieler(landscape) {

      const graph = createEmptyGraph("root");
      self.set('topLevelKielerGraph', graph);


      addNodes(landscape);
      addEdges(landscape);


      // do actual layout
      $klay.layout({
        graph: graph,
        success: function(layouted) {
          console.log("success", layouted);
        },
        error: function(error) {
          console.log("error", error);
        }
      });

    }

    function createEmptyGraph(id) {

      const CONVERT_TO_KIELER_FACTOR = self.get('CONVERT_TO_KIELER_FACTOR');

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
        "children": []
      };

      return graph;

    }



    function addNodes(landscape) {

      const topLevelKielerGraph = self.get('topLevelKielerGraph');

      const CONVERT_TO_KIELER_FACTOR = self.get('CONVERT_TO_KIELER_FACTOR');

      const systems = landscape.get('systems');

      if (systems) {
        systems.forEach((system) => {

          const DEFAULT_WIDTH = 1.5;
          const DEFAULT_HEIGHT = 0.75;

          const PADDING = 0.1;
          const SYSTEM_LABEL_HEIGHT = 0.5;

          system.set('sourcePorts', {});
          system.set('targetPorts', {});

          if (system.get('opened')) {

            const minWidth = Math.max(2.5 * DEFAULT_WIDTH *
              CONVERT_TO_KIELER_FACTOR,
              (calculateRequiredLabelLength(system.get('name'), SYSTEM_LABEL_HEIGHT) +
                PADDING * 6.0) * CONVERT_TO_KIELER_FACTOR);

            const minHeight = 2.5 * DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;

            const systemKielerGraph = createEmptyGraph(system.get('id'));
            system.set('kielerGraphReference', systemKielerGraph);

            systemKielerGraph.properties["de.cau.cs.kieler.sizeConstraint"] = "MINIMUM_SIZE";
            systemKielerGraph.properties["de.cau.cs.kieler.minWidth"] = minWidth;
            systemKielerGraph.properties["de.cau.cs.kieler.minHeight"] = minHeight;
            systemKielerGraph.properties["de.cau.cs.kieler.klay.layered.contentAlignment"] = "V_CENTER,H_CENTER";

            systemKielerGraph.padding = {
              left: PADDING * CONVERT_TO_KIELER_FACTOR,
              right: PADDING * CONVERT_TO_KIELER_FACTOR,
              top: 8 * PADDING * CONVERT_TO_KIELER_FACTOR,
              bottom: PADDING * CONVERT_TO_KIELER_FACTOR
            };

            topLevelKielerGraph.children.push(systemKielerGraph);

            const nodegroups = system.get('nodegroups');

            nodegroups.forEach((nodegroup) => {

              nodegroup.set('sourcePorts', {});
              nodegroup.set('targetPorts', {});

              if (nodegroup.get('visible')) {
                createNodeGroup(systemKielerGraph, nodegroup);
              }

            });

          } else {

            const width = Math.max(2.5 * DEFAULT_WIDTH *
              CONVERT_TO_KIELER_FACTOR,
              (calculateRequiredLabelLength(system.get('name'), SYSTEM_LABEL_HEIGHT) +
                PADDING * 6.0) * CONVERT_TO_KIELER_FACTOR);

            const height = 2.5 * DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;

            const systemKielerGraph = {
              "id": system.get('id'),
              "labels": [system.get('name')],
              "width": width,
              "height": height,
              "children": []
            };
            system.set('kielerGraphReference', systemKielerGraph);

            topLevelKielerGraph.children.push(systemKielerGraph);

          }


        });
      }

    } // END addNodes

    function createNodeGroup(systemKielerGraph, nodegroup) {

      const nodes = nodegroup.get('nodes');
      const PADDING = 0.1;
      const CONVERT_TO_KIELER_FACTOR = self.get('CONVERT_TO_KIELER_FACTOR');

      if (nodes.get('length') > 1) {

        const nodeGroupKielerGraph = createEmptyGraph(nodegroup.get('id'));
        nodegroup.set('kielerGraphReference', nodeGroupKielerGraph);

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

          if (node.get('visible')) {
            createNodeAndItsApplications(nodeGroupKielerGraph, node);

            node.get('kielerGraphReference').x = 0;
            node.get('kielerGraphReference').y = yCoord;
            yCoord = yCoord + CONVERT_TO_KIELER_FACTOR;

          }

        });

      } else {

        nodes.forEach((node) => {

          node.set('sourcePorts', {});
          node.set('targetPorts', {});

          if (node.get('visible')) {
            createNodeAndItsApplications(systemKielerGraph, node);
          }

        });

      }

    } // END createNodeGroup


    function createNodeAndItsApplications(systemKielerGraph, node) {

      const PADDING = 0.1;
      const CONVERT_TO_KIELER_FACTOR = self.get('CONVERT_TO_KIELER_FACTOR');
      const NODE_LABEL_HEIGHT = 0.25;
      const DEFAULT_WIDTH = 1.5;
      const DEFAULT_HEIGHT = 0.75;

      const nodeKielerGraph = createEmptyGraph(node.get('id'));
      node.set('kielerGraphReference', nodeKielerGraph);

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

      nodeKielerGraph.properties["de.cau.cs.kieler.sizeConstraint"] = "MINIMUM_SIZE";
      nodeKielerGraph.properties["de.cau.cs.kieler.minWidth"] = minWidth;
      nodeKielerGraph.properties["de.cau.cs.kieler.minHeight"] = minHeight;
      nodeKielerGraph.properties["de.cau.cs.kieler.klay.layered.contentAlignment"] = "V_CENTER,H_CENTER";

      systemKielerGraph.children.push(nodeKielerGraph);

      const applications = node.get('applications');

      applications.forEach((application) => {

        const DEFAULT_WIDTH = 1.5;
        const DEFAULT_HEIGHT = 0.75;

        const APPLICATION_PIC_SIZE = 0.16;
        const APPLICATION_PIC_PADDING_SIZE = 0.15;
        const APPLICATION_LABEL_HEIGHT = 0.25;

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

        application.set('kielerGraphReference', applicationKielerNode);

        nodeKielerGraph.children.push(applicationKielerNode);

      });

    } // END createNodeAndItsApplications



    function addEdges(landscape) {

      const applicationCommunication = landscape.get('applicationCommunication');

      applicationCommunication.forEach((communication) => {

        communication.set('kielerEdgeReferences', []);
        communication.set('points', []);

        console.log("Communication", communication);

        const appSource = communication.get('source');
        const appTarget = communication.get('target');

        //if (appSource && appTarget && appSource.get('parent') && appTarget.get('parent')) {

          if (appSource.get('parent').get('visible') && appTarget.get('parent').get('visible')) {
            
            //const edge = {"id": "e1", "source": appSource.get('id'), "target": appTarget.get('id')};        

            const edge = createEdgeBetweenSourceTarget(appSource, appTarget);
            //console.log("edge", edge);
            appSource.get('kielerGraphReference').edges.push(edge);
            communication.get('kielerEdgeReferences').push(edge);
          } /*
          else if (appSource.get('parent').get('visible') && !appTarget.get('parent').get('visible')) {
            if (appTarget.get('parent').get('parent').get('parent').get('opened')) {
              const representativeApplication = seekRepresentativeApplication(appTarget);
              const edge = createEdgeBetweenSourceTarget(appSource, representativeApplication);
              appSource.get('kielerGraphReference').edges.push(edge);
              communication.get('kielerEdgeReferences').push(edge);
            } else {

              // System is closed
              const edge = createEdgeBetweenSourceTarget(appSource, appTarget.get('parent').get('parent').get('parent'));
              appSource.get('kielerGraphReference').edges.push(edge);
              communication.get('kielerEdgeReferences').push(edge);
            }
          } 
          else if (!appSource.get('parent').get('visible') && appTarget.get('parent').get('visible')) {
            if (appSource.get('parent').get('parent').get('parent').get('opened')) {
              const representativeApplication = seekRepresentativeApplication(appSource);
              const edge = createEdgeBetweenSourceTarget(representativeApplication, appTarget);
              representativeApplication.get('kielerGraphReference').edges.push(edge);
              communication.get('kielerEdgeReferences').push(edge);
            } else {
              // System is closed
              const edge = createEdgeBetweenSourceTarget(appSource.get('parent').get('parent').get('parent'), appTarget);
              appSource.get('parent').get('parent').get('parent').get('kielerGraphReference').edges.push(edge);
              communication.get('kielerEdgeReferences').push(edge);
            }
          } 
          else {

            if (appSource.get('parent').get('parent').get('parent').get('opened')) {

              const representativeSourceApplication = seekRepresentativeApplication(appSource);

              if (appTarget.get('parent').get('parent').get('parent').get('opened')) {
                const representativeTargetApplication = seekRepresentativeApplication(appTarget);
                const edge = createEdgeBetweenSourceTarget(representativeSourceApplication, representativeTargetApplication);
                representativeSourceApplication.get('kielerGraphReference').edges.push(edge);
                communication.get('kielerEdgeReferences').push(edge);
              } else {
                // Target System is closed
                const edge = createEdgeBetweenSourceTarget(representativeSourceApplication, appTarget.get('parent').get('parent').get('parent'));
                representativeSourceApplication.get('kielerGraphReference').edges.push(edge);
                communication.get('kielerEdgeReferences').push(edge);
              }
            } else {

              // Source System is closed
              if (appTarget.get('parent').get('parent').get('parent').get('opened')) {
                const representativeTargetApplication = seekRepresentativeApplication(appTarget);
                const edge = createEdgeBetweenSourceTarget(appSource.get('parent').get('parent').get('parent'), representativeTargetApplication);
                appSource.get('parent').get('parent').get('parent').get('kielerGraphReference').edges.push(edge);
                communication.get('kielerEdgeReferences').push(edge);
              } else {

                // Target System is closed
                const edge = createEdgeBetweenSourceTarget(appSource.get('parent').get('parent').get('parent'), appTarget.get('parent').get('parent').get('parent'));
                appSource.get('parent').get('parent').get('parent').get('kielerGraphReference').edges.push(edge);
                communication.get('kielerEdgeReferences').push(edge);
              }
            }
          }*/
        //}
      });
    }


    function updateGraphWithResults(landscape) {

      const systems = landscape.get('systems');

      systems.forEach((system) => {

        updateNodeValues(system);

        const nodegroups = system.get('nodegroups');

        nodegroups.forEach((nodegroup) => {

          if (nodegroup.get('visible')) {

            const nodes = nodegroup.get('nodes');

            if (nodes.get('length') > 1) {
              updateNodeValues(nodegroup);
            }

            setAbsolutePositionForNode(nodegroup, system);


            nodes.forEach((node) => {

              if (node.get('visible')) {

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

      //addBendPointsInAbsoluteCoordinates(landscape);

      systems.forEach((system) => {

        const nodegroups = system.get('nodegroups');

        nodegroups.forEach((nodegroup) => {

          if (nodegroup.get('visible')) {

            const nodes = nodegroup.get('nodes');

            nodes.forEach((node) => {

              if (node.get('visible')) {

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


    function getDisplayName(system, node) {
      if (system.get('opened')) {
        if (node.get('name') && node.get('name').length !== 0 && !node.get('name').startsWith("<")) {
          return node.get('name');
        } else {
          return node.get('ipAddress');
        }
      } else {
        return system.get('name');
      }
    }


    function convertToExplorVizCoords(entity) {

      const CONVERT_TO_KIELER_FACTOR = self.get('CONVERT_TO_KIELER_FACTOR');

      entity.set('positionX', entity.get('positionX') / CONVERT_TO_KIELER_FACTOR);
      entity.set('positionY', entity.get('positionY') / CONVERT_TO_KIELER_FACTOR);

      entity.set('width', entity.get('width') / CONVERT_TO_KIELER_FACTOR);
      entity.set('height', entity.get('height') / CONVERT_TO_KIELER_FACTOR);

    }

    function setAbsolutePositionForNode(child, parent) {

      const padding = parent.get('kielerGraphReference').padding;

      //const offset = parent.get('kielerGraphReference').offset;

      //console.log(offset);

      child.set('positionX', parent.get('positionX') + child.get('positionX') + padding.left);
      child.set('positionY', parent.get('positionY') + child.get('positionY') - padding.top);
    }


    function updateNodeValues(entity) {

      entity.set('positionX', entity.get('kielerGraphReference').x);

      // KIELER has inverted Y coords
      entity.set('positionY', entity.get('kielerGraphReference').y * -1);

      entity.set('width', entity.get('kielerGraphReference').width);
      entity.set('height', entity.get('kielerGraphReference').height);

    }


    function calculateRequiredLabelLength(text, quadSize) {

      const SPACE_BETWEEN_LETTERS_IN_PERCENT = 0.09;

      if (text == null || text.empty) {
        return 0;
      }

      return ((text.length * quadSize * 0.5) +
        ((text.length - 1) * quadSize * SPACE_BETWEEN_LETTERS_IN_PERCENT));
    }


    function createEdgeBetweenSourceTarget(sourceApplication, targetApplication) {

      console.log(sourceApplication.get('name') + " und " + targetApplication.get('name'));

      const port1 = createSourcePortIfNotExisting(sourceApplication);
      const port2 = createTargetPortIfNotExisting(targetApplication);

      return createEdgeHelper(sourceApplication, port1, targetApplication, port2);
    }


    function createSourcePortIfNotExisting(sourceDrawnode) {
      return createPortHelper(sourceDrawnode, sourceDrawnode.get('targetPorts'), "EAST");
    }


    function createTargetPortIfNotExisting(targetDrawnode) {
      return createPortHelper(targetDrawnode, targetDrawnode.get('targetPorts'), "WEST");
    }


    function createPortHelper(drawnode, ports, portSide) {

      const DEFAULT_PORT_WIDTH = 0.000001;
      const DEFAULT_PORT_HEIGHT = 0.000001;

      const CONVERT_TO_KIELER_FACTOR = 180;

      const maybePort = ports[drawnode.get('id')];

      if (maybePort == null) {

        const length = Object.keys(ports).length;

        const portId = drawnode.get('id') + "_p" + (length + 1);

        const port = {
          id: portId,
          width: DEFAULT_PORT_WIDTH * CONVERT_TO_KIELER_FACTOR,
          height: DEFAULT_PORT_HEIGHT * CONVERT_TO_KIELER_FACTOR,
          properties: {
            "de.cau.cs.kieler.portSide": portSide
          }
        };

        port.node = drawnode.get('kielerGraphReference');

        drawnode.get('kielerGraphReference').ports.push(port);

        ports[drawnode.get('id')] = port;
      }

      return ports[drawnode.get('id')];

    }


    function createEdgeHelper(sourceDrawnode, port1, targetDrawnode, port2) {

      console.log(port2);

      const id = sourceDrawnode.get('id') + "_" + targetDrawnode.get('id');

      //console.log("port1", port1);
      //console.log("port2", port2);

      //console.log(id);
           
      // TODO create port in related node for reference

      const edge = createNewEdge(id);

      setEdgeLayoutProperties(edge);

      //edge.sourcePort = port1.id;
      //edge.targetPort = port2.id;

      //edge.sPort = port1;
      //edge.tPort = port2;

      edge.source = sourceDrawnode.get('id');
      edge.target = targetDrawnode.get('id');

      //edge.sourceNode = sourceDrawnode;
      //edge.targetNode = targetDrawnode;

      return edge;
    }

    function createNewEdge(id) {
      const kielerEdge = {
        id: id
      };
      return kielerEdge;
    }

    function setEdgeLayoutProperties(edge) {
      const CONVERT_TO_KIELER_FACTOR = self.get('CONVERT_TO_KIELER_FACTOR');
      const lineThickness = 0.06 * 4.0 + 0.01;
      const oldThickness = edge.thickness ? edge.thickness : 0.0;
      edge.thickness = Math.max(lineThickness * CONVERT_TO_KIELER_FACTOR, oldThickness);
    }

   /* function seekRepresentativeApplication(application) {

      const nodes = application.get('parent').get('parent').get('nodes');

      let returnValue = null;

      nodes.forEach((node) => {
        if (node.get('visible')) {

          const applications = node.get('applications');

          applications.forEach((representiveApplication) => {

            if (representiveApplication.get('name') === application.get('name')) {
              returnValue = representiveApplication;
            }
          });
        }
      });

      return returnValue ? returnValue : null;
    }*/


    /*function addBendPointsInAbsoluteCoordinates(landscape) {

      const applicationCommunication = landscape.get('applicationCommunication');

      applicationCommunication.forEach((communication) => {

        const kielerEdgeReferences = communication.get('kielerEdgeReferences');

        //console.log(kielerEdgeReferences);

        kielerEdgeReferences.forEach((edge) => {

          //console.log(edge);

          if (edge != null) {

            let parentNode = getRightParent(communication.get('source'), communication.get('target'));

            var points = [];
            let edgeOffset = 0.0;

            if (parentNode != null) {

              //console.log(edge);

              points = edge.bendPoints ? edge.bendPoints : [];

              //console.log("points", points);

              //edgeOffset = new KVector()
              edgeOffset = {};

              if (parentNode.get('kielerGraphReference') != null) {
                edgeOffset = parentNode.get('kielerGraphReference').offset;
              }

              var sourcePoint = null;

              //if (LGraphUtil::isDescendant(edge.getTarget().getNode(), edge.getSource().getNode())) {
              if (edge.target === edge.source) {

                // self edges..
                let sourcePort = edge.sPort;

                // public static KVector sum(final KVector...vs) {
                //   final KVector sum = new KVector();
                //   for (final KVector v: vs) {
                //     sum.x += v.x;
                //     sum.y += v.y;
                //   }
                //   return sum;
                // }

                //sourcePoint = KVector.sum(sourcePort.getPosition(), sourcePort.getAnchor());
                sourcePoint = {
                  x: sourcePort.x,
                  y: sourcePort.y
                };


                /*var sourceInsets = sourcePort.getNode().getInsets();
                sourcePoint.add(-sourceInsets.left, -sourceInsets.top);
                var nestedGraph = sourcePort.getNode().getProperty(InternalProperties.NESTED_LGRAPH);
                if (nestedGraph != null) {
                  edgeOffset = nestedGraph.getOffset();
                }
                sourcePoint.sub(edgeOffset);
              } else {
                //sourcePoint = edge.getSource().getAbsoluteAnchor();                
                if (edge.sourcePoint) {
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

              points.push(sourcePoint);

              console.log(edge);

              // var targetPoint = edge.targetPoint ? {
              //   x: edge.targetPoint.x,
              //   y: edge.targetPoint.y
              // } : {
              //   x: edge.tPort.x,
              //   y: edge.tPort.y
              // };
              /*if (edge.getProperty(InternalProperties.TARGET_OFFSET) != null) {
                targetPoint.add(edge.getProperty(InternalProperties.TARGET_OFFSET));
              } */
              /* points.addLast(targetPoint)
               for (point: points) {
                 point.add(edgeOffset)
               }

               var pOffsetX = 0 f
               var pOffsetY = 0 f
               if (parentNode != null) {
                 var insetLeft = 0 f
                 var insetTop = 0 f

                 if (parentNode.kielerGraphReference != null) {
                   insetLeft = parentNode.kielerGraphReference.insets.left as float
                   insetTop = parentNode.kielerGraphReference.insets.top as float
                 }

                 if (parentNode instanceof System) {
                   pOffsetX = insetLeft
                   pOffsetY = insetTop * -1
                 } else {
                   pOffsetX = parentNode.positionX + insetLeft
                   pOffsetY = parentNode.positionY - insetTop

                 }
               }

               for (point: points) {
                 val resultPoint = new Point()
                 resultPoint.x = (point.x as float + pOffsetX) / CONVERT_TO_KIELER_FACTOR
                 resultPoint.y = (point.y as float * -1 + pOffsetY) / CONVERT_TO_KIELER_FACTOR // KIELER has inverted Y coords
                 communication.points.add(resultPoint)
               } 
            }
          }
        });
      });
    } // END addBendPoints */


    /*function getRightParent(sourceApplication, targetApplication) {
      let result = sourceApplication.get('parent');
      if (!sourceApplication.get('parent').get('visible')) {
        if (!sourceApplication.get('parent').get('parent').get('parent').get('opened')) {
          if (sourceApplication.get('parent').get('parent').get('parent') !== targetApplication.get('parent').get('parent').get('parent')) {
            result = sourceApplication.get('parent').get('parent').get('parent');
          } else {
            result = null; // means don't draw
          }
        } else {
          result = seekRepresentativeApplication(sourceApplication);
          if (result != null) {
            result = result.get('parent');
          }
        }
      }
      return result;
    }*/



  } // END applayLayout


});