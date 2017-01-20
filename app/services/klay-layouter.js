import Ember from 'ember';

export default Ember.Service.extend({

  topLevelKielerGraph: null,

  CONVERT_TO_KIELER_FACTOR: 180.0,

  applyLayout(landscape) {

    const self = this;

    setupKieler(landscape);


    // Functions

    function setupKieler(landscape) {

      const graph = createEmptyGraph("root");
      self.set('topLevelKielerGraph', graph);


      addNodes(landscape);
      //addEdges(landscape);

      updateGraphWithResults(landscape);


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
        "direction": "RIGHT",
        "spacing": 0.2 * CONVERT_TO_KIELER_FACTOR,
        "edgeRouting": "POLYLINE",
        "borderSpacing": 0.2 * CONVERT_TO_KIELER_FACTOR,
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

            systemKielerGraph.properties["de.cau.cs.kieler.minWidth"] = minWidth;
            systemKielerGraph.properties["de.cau.cs.kieler.minHeight"] = minHeight;
            systemKielerGraph.properties["de.cau.cs.kieler.sizeConstraint"] = "MINIMUM_SIZE";
            systemKielerGraph.properties["de.cau.cs.kieler.klay.layered.contentAlignment"] = "V_CENTER,H_CENTER";

            //Linset still missing

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
              "properties": {
                "de.cau.cs.kieler.size.x": width,
                "de.cau.cs.kieler.size.y": height
              },
              "children": []
            };

            topLevelKielerGraph.children.push(systemKielerGraph);

          }


        });
      }

    } // END addNodes

    function createNodeGroup(systemKielerGraph, nodegroup) {

      const nodes = nodegroup.get('nodes');

      if (nodes.get('length') > 1) {

        const nodeGroupKielerGraph = createEmptyGraph(nodegroup.get('id'));
        nodegroup.set('kielerGraphReference', nodeGroupKielerGraph);

        nodeGroupKielerGraph.properties["de.cau.cs.kieler.klay.layered.crossMin"] = "LAYER_SWEEP";
        //Linsets still missing

        systemKielerGraph.children.push(nodeGroupKielerGraph);

        const sortedNodes = nodes.sortBy('ipAddress');

        // Do we need to set the model to sortedNodes ???

        sortedNodes.forEach((node) => {

          if (node.get('visible')) {
            createNodeAndItsApplications(nodeGroupKielerGraph, node);

            // Set Position ???
            /* val position = node.kielerNodeReference.position
            position.x = 0
            position.y = yCoord
            yCoord = yCoord + CONVERT_TO_KIELER_FACTOR*/
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

      const nodeKielerGraph = createEmptyGraph(node.get('id'));
      node.set('kielerGraphReference', nodeKielerGraph);
      //Linsets still missing

      systemKielerGraph.children.push(nodeKielerGraph);

      const applications = node.get('applications');

      applications.forEach((application) => {

        const DEFAULT_WIDTH = 1.5;
        const DEFAULT_HEIGHT = 0.75;

        const APPLICATION_PIC_SIZE = 0.16;
        const APPLICATION_PIC_PADDING_SIZE = 0.15;
        const APPLICATION_LABEL_HEIGHT = 0.25;

        const PADDING = 0.1;

        const CONVERT_TO_KIELER_FACTOR = self.get('CONVERT_TO_KIELER_FACTOR');

        const posX = Math.max(DEFAULT_WIDTH * CONVERT_TO_KIELER_FACTOR,
          (calculateRequiredLabelLength(application.get('name'), APPLICATION_LABEL_HEIGHT) +
            APPLICATION_PIC_PADDING_SIZE + APPLICATION_PIC_SIZE +
            PADDING * 3.0) * CONVERT_TO_KIELER_FACTOR);

        const posY = DEFAULT_HEIGHT * CONVERT_TO_KIELER_FACTOR;


        const applicationKielerNode = {
          "id": application.get('id'),
          "labels": [application.get('name')],
          "x": posX,
          "y": posY,
          "properties": {
            //"de.cau.cs.kieler.position.x": posX,
            //"de.cau.cs.kieler.position.y": posY
          },
          "children": []
        };

        nodeKielerGraph.children.push(applicationKielerNode);

      });

    } // END createNodeAndItsApplications


    function updateGraphWithResults(landscape) {

      const systems = landscape.get('systems');

      systems.forEach((system) => {

        updateNodeValues(system);

      });



    } // END updateGraphWithResults


    function updateNodeValues(entity) {

     /* entity.set('positionX', entity.get('kielerNodeReference').position.x);

      // KIELER has inverted Y coords
      entity.set('positionY', entity.get('kielerNodeReference').position.y * -1);

      entity.set('width', entity.get('kielerNodeReference').size.x);
      entity.set('height', entity.get('kielerNodeReference').size.y);*/

    }



    function calculateRequiredLabelLength(text, quadSize) {

      const SPACE_BETWEEN_LETTERS_IN_PERCENT = 0.09;

      if (text == null || text.empty) {
        return 0;
      }

      return ((text.length * quadSize * 0.5) +
        ((text.length - 1) * quadSize * SPACE_BETWEEN_LETTERS_IN_PERCENT));
    }



  } // END applayLayout


});