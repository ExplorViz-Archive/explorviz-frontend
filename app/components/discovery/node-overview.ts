import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import debugLogger from 'ember-debug-logger';
import Agent from 'explorviz-frontend/models/agent';
import Procezz from 'explorviz-frontend/models/procezz';
import Configuration from 'explorviz-frontend/services/configuration';
import AgentRepository from 'explorviz-frontend/services/repos/agent-repository';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import nameSelector from 'explorviz-frontend/utils/helpers/name-selector';

declare const cytoscape: any;

interface IArgs {
  showDetails(emberRecord: any): void;
}

export default class NodeOverview extends Component<IArgs> {
  debug = debugLogger('NodeOverview');

  @service('repos/agent-repository')
  agentRepo!: AgentRepository;

  @service('configuration')
  configuration!: Configuration;

  cytoscapeGraph: any = null;
  cytoscapeLayout: any = null;

  showCytoscape = false;

  initDone = false;

  @tracked
  showHiddenMessage = false;

  cytoscapeGraphListener: ((evt: any) => void)|null = null;

  @action
  enableShowHidden() {
    this.initDone = false;
    set(this.configuration.discoverySettings, 'showHiddenEntities', true);
    this.showHiddenMessage = false;
  }

  /**
   * This method renders the actual cytoscapeGraph
   */
  @action
  renderGraph() {
    if (!this.initDone && this.agentRepo.agentList.length > 0) {
      this.initCytoscape();
      this.setupListener();
      this.initDone = true;
    }
    this.updateCytoscapeGraph(this.agentRepo.agentList);
  }


  // @Override
  /**
   * This overridden Glimmer Component lifecycle hook enables calling
   * custom cleanup code.
   *
   * @method willDestroy
   */
  willDestroy() {
    super.willDestroy();
    this.removeListener();
  }


  setupListener() {
    this.cytoscapeGraphListener = (evt: any) => { this.cytoscapeOnTap(evt); };

    if (this.cytoscapeGraph) {
      this.cytoscapeGraph.on('tap', 'node', this.cytoscapeGraphListener);
    }
  }

  cytoscapeOnTap(evt: any) {
    const emberModel = evt.target.data().emberModel;

    if (emberModel) {
      // closure action of discovery controller
      this.args.showDetails(emberModel);
    }
  }

  removeListener() {
    if (this.initDone) {
      if (this.cytoscapeGraph) {
        this.cytoscapeGraph.off('tap', 'node', this.cytoscapeGraphListener);
      }
    }
  }


  // possible TODO https://github.com/cytoscape/cytoscape.js-cola/issues/14


  /**
   * This function is called once on the didRender event.
   * It initializes cytoscape
   *
   * @method initCytoscape
   */
  initCytoscape() {
    const cy = cytoscape({
      container: document.getElementById('cy'),

      autounselectify: true,
      boxSelectionEnabled: false,

      style: cytoscape.stylesheet()
        .selector('#expLogo')
          .css({
            'background-fit': 'cover',
            'background-image': 'images/explorviz-logo.png',
            content: '',
          })
        .selector('.edge')
          .css({
            'curve-style': 'bezier',
            'line-color': '#ddd',
            'target-arrow-color': '#ddd',
            'target-arrow-shape': 'triangle',
            width: 10,
          })
        .selector('.edge-monitoring-enabled')
          .css({
            'curve-style': 'bezier',
            'line-color': '#94f2a2',
            'target-arrow-color': '#94f2a2',
            'target-arrow-shape': 'triangle',
            width: 10,
          })
        .selector('.edge-stopped')
          .css({
            'curve-style': 'bezier',
            'line-color': '#f4ffa8',
            'target-arrow-color': '#f4ffa8',
            'target-arrow-shape': 'triangle',
            width: 10,
          })
        .selector('.edge-error')
          .css({
            'curve-style': 'bezier',
            'line-color': '#ff0000',
            'target-arrow-color': '#ff0000',
            'target-arrow-shape': 'triangle',
            width: 10,
          })
        .selector('.procezz')
          .css({
            content: 'data(name)',
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
            'background-color': '#90EE90',
            content: 'data(id)',
          })
        .selector('.agent-error')
          .css({
            'background-color': '#ff0000',
            content: 'data(id)',
          })
        .selector('.hidden')
          .css({
            opacity: 0.5,
          })
        .selector('.highlighted')
          .css({
            'background-color': '#61bffc',
            'line-color': '#61bffc',
            'target-arrow-color': '#61bffc',
            'transition-duration': '0.5s',
            'transition-property': 'background-color, line-color, target-arrow-color',
          }),

      elements: {
        edges: [],
        nodes: [
          { data: { id: 'expLogo' } },
        ],
      },
    });

    const layout = cy.layout({
      directed: true,
      name: 'breadthfirst',
      padding: 10,
    });

    this.cytoscapeGraph = cy;
    this.cytoscapeLayout = layout;

    layout.run();
  }


  updateCytoscapeGraph(newAgentList: Agent[]) {
    const cy = this.cytoscapeGraph;
    const layout = this.cytoscapeLayout;

    if (!(cy && layout) || !newAgentList) {
      return;
    }

    this.debug('updating cytoscapeGraph');

    // cy.startBatch();

    let cyOldPanPosition = null;
    let cyOldZoomValue = null;
    let cyOldProcezzCount = null;

    if (cy.collection('.procezz').length > 0) {
      cyOldPanPosition = cy.pan();
      cyOldZoomValue = cy.zoom();
      cyOldProcezzCount = cy.collection('.procezz').length;
    }

    // remove all old elements
    cy.elements().remove();

    const explorVizNode = {
      edges: [],
      nodes: [
        {
          data: { id: 'expLogo' },
        },
      ],
    };

    cy.add(explorVizNode);

    const showHiddenEntities = this.configuration.discoverySettings.showHiddenEntities;

    let isAtLeastOneSet = false;

    newAgentList.forEach((agentRecord) => {
      const agentHidden = agentRecord.get('isHidden');

      if (agentHidden && !showHiddenEntities) {
        // skip this agent
        // proceed with next one
        return;
      }

      const ip = agentRecord.get('ip');
      const port = agentRecord.get('port');
      const agentName = nameSelector(`${ip}:${port}`, agentRecord.get('name'));
      const edgeIDAgent = `${agentName}_ToexpLogo`;

      const faultyAgent = agentRecord.get('errorOccured');

      let cssClassAgent = faultyAgent ? 'agent-error' : 'agent';

      cssClassAgent = agentHidden ? 'hidden ' + cssClassAgent : cssClassAgent;

      let cssClassAgentEdge = faultyAgent ? 'edge-error' : 'edge';

      cssClassAgentEdge = agentHidden ? 'hidden ' + cssClassAgentEdge : cssClassAgentEdge;

      const agentAndEdge = {
        edges: [
          {
            classes: cssClassAgentEdge,
            data: { id: edgeIDAgent, source: agentName, target: 'expLogo' },
          },
        ],
        nodes: [
          {
            classes: cssClassAgent,
            data: { id: agentName, emberModel: agentRecord },
          },
        ],
      };

      cy.add(agentAndEdge);

      isAtLeastOneSet = true;

      // look for procezzes and add to graph
      const procezzes = agentRecord.get('procezzes');
      procezzes.forEach((procezzRecord: Procezz) => {
        const procezzHidden = procezzRecord.get('isHidden');

        if (procezzHidden && !showHiddenEntities) {
          // skip this procezz if user
          // does not want to show hidden procezzes
          // -> proceed with next one
          return;
        }

        const procezzName = nameSelector(`${procezzRecord.get('pid')}`, procezzRecord.get('name'));

        const procezzID = procezzRecord.get('id');

        const edgeID = procezzID + 'To' + agentName;

/*         const monitoredEnabled =
          procezzRecord.get('wasFoundByBackend') && procezzRecord.get('monitoredFlag'); */

        const monitoredEnabled = procezzRecord.get('monitoredFlag');
        const faultyProcezz = procezzRecord.get('errorOccured');
        const stoppedProcezz = procezzRecord.get('stopped');

        let cssClassProcezz = 'procezz';
        let cssClassEdge = 'edge';

        if (monitoredEnabled) {
          cssClassProcezz += ' procezz-monitoring-enabled';
          cssClassEdge += ' edge-monitoring-enabled';
        }
        if (faultyProcezz) {
          cssClassProcezz += ' procezz-error';
          cssClassEdge += ' edge-error';
        }
        if (procezzHidden) {
          cssClassProcezz += ' hidden';
          cssClassEdge += ' hidden';
        }
        if (stoppedProcezz) {
          cssClassProcezz += ' procezz-stopped';
          cssClassEdge += ' edge-stopped';
        }

        const procezzAndEdge = {
          edges: [
            {
              classes: cssClassEdge,
              data: { id: edgeID, source: procezzID, target: agentName },
            },
          ],
          nodes: [
            {
              classes: cssClassProcezz,
              data: { id: procezzID, emberModel: procezzRecord, name: procezzName },
            },
          ],
        };

        cy.add(procezzAndEdge);
      });
    });
    // END agentList loop

    this.showCytoscape = isAtLeastOneSet;
    this.showHiddenMessage = !isAtLeastOneSet;

    // cy.endBatch();
    layout.options.eles = cy.elements();
    layout.run();

    // Apply old manipulation
    if (cyOldPanPosition) {
      cy.pan(cyOldPanPosition);
      cy.zoom(cyOldZoomValue);

      const cyNewProcezzCount = cy.collection('.procezz').length;

      // if there is a new procezz, reset manipulation.
      // otherwise zoom acts weird (bugged) in cytoscape.js
      if (cyOldProcezzCount !== cyNewProcezzCount) {
        cy.fit();
        let alertifyMessage = 'New Procezz(es) found.';

        if (cyOldProcezzCount > cyNewProcezzCount) {
          alertifyMessage = 'Procezzes gone, potential agent failure';
        }

        const alertifyMessageDuration = 4;
        AlertifyHandler.showAlertifyMessageWithDuration(alertifyMessage, alertifyMessageDuration);
      }
    }
  }
}
