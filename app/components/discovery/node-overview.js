import Component from '@ember/component';
import { inject as service } from '@ember/service';
import nameSelector from 'explorviz-frontend/utils/helpers/name-selector';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import debugLogger from 'ember-debug-logger';

/* global cytoscape */

export default Component.extend({

  // No Ember generated container
  tagName: '',

  debug: debugLogger(),

  agentRepo: service("repos/agent-repository"),
  configuration: service("configuration"),

  cytoscapeGraph: null,
  cytoscapeLayout: null,

  showCytoscape: false,

  initDone: false,
  showHiddenMessage: false,

  actions: {
    enableShowHidden() {
      this.set('initDone', false);
      this.set('configuration.discoverySettings.showHiddenEntities', true);
      this.set('showHiddenMessage', false);
    }
  },

  // @Override
  /**
   * This overridden Ember Component lifecycle hook is used
   * to render the actual cytoscapeGraph
   *
   * @method didRender
   */
  didRender(){    
    this._super(...arguments);
    
    if(!this.get('initDone') && this.get('agentRepo.agentList.length') > 0) {
      this.initCytoscape();
      this.setupListener();
      this.set('initDone', true);
    }
    this.updateCytoscapeGraph(this.get('agentRepo.agentList'));
  },


  // @Override
  /**
   * This overridden Ember Component lifecycle hook enables calling
   * custom cleanup code.
   *
   * @method willDestroyElement
   */
  willDestroyElement() {
    this._super(...arguments);
    this.removeListener();
  },


  setupListener() {
    const self = this;

    if(this.get('cytoscapeGraph')) {
      this.get('cytoscapeGraph').on('tap', 'node', function (evt) {

        const emberModel = evt.target.data().emberModel;

        if(emberModel) {
          // closure action of discovery controller        
          self.showDetails(emberModel);
        }

      });
    }
  },


  removeListener() {
    if(this.get('initDone')) {

      if(this.get('agentRepo')) {
        this.get('agentRepo').off('updated');
      }

      if(this.get('cytoscapeGraph')) {
        this.get('cytoscapeGraph').off('tap');
      }     
      
    }
  },


  //possible TODO https://github.com/cytoscape/cytoscape.js-cola/issues/14


  /**
   * This function is called once on the didRender event.
   * It initializes cytoscape 
   *
   * @method initCytoscape
   */
  initCytoscape() {

    const cy = cytoscape({
      container: document.getElementById('cy'),

      boxSelectionEnabled: false,
      autounselectify: true,

      style: cytoscape.stylesheet()
        .selector('#expLogo')
          .css({
            'content': '',
            'background-fit': 'cover',
            'background-image': 'images/explorviz-logo.png'
          })    
        .selector('.edge')
          .css({
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'width': 10,
            'line-color': '#ddd',
            'target-arrow-color': '#ddd'
          })      
        .selector('.edge-monitoring-enabled')
          .css({
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'width': 10,
            'line-color': '#94f2a2',
            'target-arrow-color': '#94f2a2'
          })
        .selector('.edge-stopped')
          .css({
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'width': 10,
            'line-color': '#f4ffa8',
            'target-arrow-color': '#f4ffa8'
          })
        .selector('.edge-error')
          .css({
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'width': 10,
            'line-color': '#ff0000',
            'target-arrow-color': '#ff0000'
          })
        .selector('.procezz')
          .css({
            'content': 'data(name)'
          })
        .selector('.procezz-monitoring-enabled')
          .css({
            'background-color': '#37ca4d',
          })
        .selector('.procezz-stopped')
          .css({
            'background-color': '#e4ff19',
          })
        .selector('.procezz-error')
          .css({
            'background-color': '#ff0000',
          })
        .selector('.agent')
          .css({
            'content': 'data(id)',
            'background-color': '#90EE90'
          })
        .selector('.agent-error')
          .css({
            'content': 'data(id)',
            'background-color': '#ff0000'
          })
        .selector('.hidden')
          .css({
            'opacity': 0.5
          })
        .selector('.highlighted')
          .css({
            'background-color': '#61bffc',
            'line-color': '#61bffc',
            'target-arrow-color': '#61bffc',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
          }),

      elements: {
          nodes: [
            { data: { id: 'expLogo' } }
          ],
          edges: []
        }
    });

    const layout = cy.layout({
      name: 'breadthfirst',
      directed: true,
      padding: 10
    });

    this.set('cytoscapeGraph', cy);
    this.set('cytoscapeLayout', layout);

    layout.run();
  },


  updateCytoscapeGraph(newAgentList) {

    const cy = this.get('cytoscapeGraph');
    const layout = this.get('cytoscapeLayout');

    if(!(cy && layout) || !newAgentList) {
      return;
    }

    this.debug('updating cytoscapeGraph');

    //cy.startBatch();

    let cyOldPanPosition = null;
    let cyOldZoomValue = null;
    let cyOldProcezzCount = null;

    if(cy.collection('.procezz').length > 0) {
      cyOldPanPosition = cy.pan();
      cyOldZoomValue = cy.zoom();
      cyOldProcezzCount = cy.collection('.procezz').length;
    }

    // remove all old elements
    cy.elements().remove();

    const explorVizNode = {
      nodes: [
        { 
          data: { id: 'expLogo' }
        }
      ],
      edges: []
    };

    cy.add(explorVizNode);

    const showHiddenEntities = this.get('configuration.discoverySettings.showHiddenEntities');

    let isAtLeastOneSet = false;

    newAgentList.forEach((agentRecord) => {

      const agentHidden = agentRecord.get('isHidden');

      if(agentHidden && !showHiddenEntities) {
        // skip this agent
        // proceed with next one
        return;
      }
      
      const ip = agentRecord.get('ip');
      const port = agentRecord.get('port');
      const agentName = nameSelector(ip + ":" + port, agentRecord.get('name'));
      const edgeIDAgent = agentName + "_ToexpLogo";

      const faultyAgent = agentRecord.get('errorOccured');

      let cssClassAgent = faultyAgent ? 
        "agent-error" : "agent";

      cssClassAgent = agentHidden ? 
         "hidden " + cssClassAgent : cssClassAgent;

      let cssClassAgentEdge = faultyAgent ? 
        "edge-error" : "edge";

      cssClassAgentEdge = agentHidden ? 
        "hidden " + cssClassAgentEdge : cssClassAgentEdge;

      const agentAndEdge = {
        nodes: [
          { 
            data: { id: agentName, emberModel: agentRecord}, 
            classes: cssClassAgent
          }
        ],
        edges: [
          { 
            data: { id: edgeIDAgent, source: agentName, target: 'expLogo' },
            classes: cssClassAgentEdge
          }
        ]
      };

      cy.add(agentAndEdge);

      isAtLeastOneSet = true;

      // look for procezzes and add to graph
      const procezzes = agentRecord.get('procezzes');
      procezzes.forEach((procezzRecord) => {

        const procezzHidden = procezzRecord.get('isHidden');

        if(procezzHidden && !showHiddenEntities) {
          // skip this procezz if user
          // does not want to show hidden procezzes
          // -> proceed with next one
          return;
        }

        const procezzName = nameSelector(procezzRecord.get('pid'), procezzRecord.get('name'));

        const procezzID = procezzRecord.get('id');

        const edgeID = procezzID + "To" + agentName;

        //const monitoredEnabled = procezzRecord.get('wasFoundByBackend') && procezzRecord.get('monitoredFlag');
        const monitoredEnabled = procezzRecord.get('monitoredFlag');
        const faultyProcezz = procezzRecord.get('errorOccured');
        const stoppedProcezz = procezzRecord.get('stopped');

        let cssClassProcezz = "procezz";
        let cssClassEdge = "edge";

        if(monitoredEnabled) {
          cssClassProcezz +=  " procezz-monitoring-enabled";
          cssClassEdge +=  " edge-monitoring-enabled";
        }
        if(faultyProcezz) {
          cssClassProcezz +=  " procezz-error";
          cssClassEdge +=  " edge-error";
        }
        if(procezzHidden) {
          cssClassProcezz +=  " hidden";
          cssClassEdge +=  " hidden";
        }
        if(stoppedProcezz) {
          cssClassProcezz +=  " procezz-stopped";
          cssClassEdge +=  " edge-stopped";
        }

        const procezzAndEdge = {
          nodes: [
            { 
              data: { id: procezzID, emberModel: procezzRecord, name: procezzName}, 
              classes: cssClassProcezz
            }
          ],
          edges: [
            { 
              data: { id: edgeID, source: procezzID, target: agentName },
              classes: cssClassEdge
            }
          ]
        };

        cy.add(procezzAndEdge);
          
      });

    });
    // END agentList loop

    this.set('showCytoscape', isAtLeastOneSet);
    this.set('showHiddenMessage', !isAtLeastOneSet);

    //cy.endBatch();
    layout.options.eles = cy.elements();
    layout.run();

    // Apply old manipulation
    if(cyOldPanPosition) {
      cy.pan(cyOldPanPosition);
      cy.zoom(cyOldZoomValue);

      const cyNewProcezzCount = cy.collection('.procezz').length;

      // if there is a new procezz, reset manipulation.
      // otherwise zoom acts weird (bugged) in cytoscape.js
      if(cyOldProcezzCount !== cyNewProcezzCount) {
        cy.fit();
        let alertifyMessage = "New Procezz(es) found.";

        if(cyOldProcezzCount > cyNewProcezzCount) {
          alertifyMessage = "Procezzes gone, potential agent failure";
        }

        AlertifyHandler.showAlertifyMessageWithDuration(alertifyMessage, 4);
      }
    }
  }

});