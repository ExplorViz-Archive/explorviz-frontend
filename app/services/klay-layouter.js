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

          if (node.get('visible')) {
            createNodeAndItsApplications(nodeGroupKielerGraph, node);

            node.get('kielerGraphReference').x = 0;
            node.get('kielerGraphReference').y = yCoord;
            yCoord = yCoord + CONVERT_TO_KIELER_FACTOR;

          }

        });

      } else {

        nodes.forEach((node) => {

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

        const width = Math.max(DEFAULT_WIDTH * CONVERT_TO_KIELER_FACTOR,
          (calculateRequiredLabelLength(application.get('name'), APPLICATION_LABEL_HEIGHT) +
            APPLICATION_PIC_PADDING_SIZE + APPLICATION_PIC_SIZE +
            PADDING * 3.0) * CONVERT_TO_KIELER_FACTOR);

        const height = DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;

        const applicationKielerNode = {
          "id": application.get('id'),
          "width": width,
          "height": height,
          "children": []
        };

        application.set('kielerGraphReference', applicationKielerNode);

        nodeKielerGraph.children.push(applicationKielerNode);

      });

    } // END createNodeAndItsApplications



    function addEdges(landscape) {

      const applicationCommunication = landscape.get('applicationCommunication');

      applicationCommunication.forEach((communication) => {
        //communication.kielerEdgeReferences.clear()
        //communication.points.clear()

        const appSource = communication.get('source');
        const appTarget = communication.get('target');

        if (appSource && appTarget && appSource.get('parent') && appTarget.get('parent')) {

          if (appSource.get('parent').get('visible') && appTarget.get('parent').get('visible')) {
            communication.get('kielerEdgeReferences').push(createEdgeBetweenSourceTarget(appSource, appTarget));
          } else if (appSource.get('parent').get('visible') && !appTarget.get('parent').get('visible')) {
            if (appTarget.get('parent').get('parent').get('parent').get('opened')) {
              const representativeApplication = seekRepresentativeApplication(appTarget);
              communication.get('kielerEdgeReferences').push(
                createEdgeBetweenSourceTarget(
                  appSource,
                  representativeApplication
                ));
            } else {

              // System is closed
              communication.get('kielerEdgeReferences').push(
                createEdgeBetweenSourceTarget(
                  appSource,
                  appTarget.get('parent').get('parent').get('parent')
                ));
            }
          } else if (!appSource.get('parent').get('visible') && appTarget.get('parent').get('visible')) {
            if (appSource.get('parent').get('parent').get('parent').get('opened')) {
              const representativeApplication = seekRepresentativeApplication(appSource);
              communication.get('kielerEdgeReferences').push(
                createEdgeBetweenSourceTarget(
                  representativeApplication,
                  appTarget
                ));
            } else {
              // System is closed
              communication.get('kielerEdgeReferences').push(
                createEdgeBetweenSourceTarget(
                  appSource.parent.parent.parent,
                  appTarget
                ));
            }
          } else {

            if (appSource.get('parent').get('parent').get('parent').get('opened')) {

              const representativeSourceApplication = seekRepresentativeApplication(appSource);

              if (appTarget.get('parent').get('parent').get('parent').get('opened')) {
                const representativeTargetApplication = seekRepresentativeApplication(appTarget);
                communication.get('kielerEdgeReferences').push(
                  createEdgeBetweenSourceTarget(representativeSourceApplication,
                    representativeTargetApplication));
              } else {
                // Target System is closed
                communication.get('kielerEdgeReferences').push(
                  createEdgeBetweenSourceTarget(representativeSourceApplication,
                    appTarget.get('parent').get('parent').get('parent')));
              }
            } else {

              // Source System is closed
              if (appTarget.get('parent').get('parent').get('parent').get('opened')) {
                const representativeTargetApplication = seekRepresentativeApplication(appTarget);
                communication.get('kielerEdgeReferences').push(
                  createEdgeBetweenSourceTarget(appSource.get('parent').get('parent').get('parent'),
                    representativeTargetApplication));
              } else {

                // Target System is closed
                communication.get('kielerEdgeReferences').push(
                  createEdgeBetweenSourceTarget(
                    appSource.get('parent').get('parent').get('parent'),
                    appTarget.get('parent').get('parent').get('parent')
                  ));
              }
            }
          }
        }
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
      const port1 = createSourcePortIfNotExisting(sourceApplication);
      const port2 = createTargetPortIfNotExisting(targetApplication);

      createEdgeHelper(sourceApplication, port1, targetApplication, port2);
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

      if (!maybePort) {

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

        ports[drawnode.get('id')] = port;
      }

      return ports[drawnode.get('id')];

    }


    function createEdgeHelper(sourceDrawnode, port1, targetDrawnode, port2) {

      const id = sourceDrawnode.get('id') + "_" + targetDrawnode.get('id');


      const edge = createNewEdge(id);

      setEdgeLayoutProperties(edge);

      edge.source = port1.id;
      edge.target = port2.id;
      edge.sourcePort = port1.id;
      edge.targetPort = port1.id;

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
      const oldThickness = edge.thickness;
      edge.thickness = Math.max(lineThickness * CONVERT_TO_KIELER_FACTOR, oldThickness);
    }

    function seekRepresentativeApplication(application) {

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
    }



  } // END applayLayout


});