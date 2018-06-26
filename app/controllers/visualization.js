import Controller from '@ember/controller';
import { inject as service } from '@ember/service'; 
import { computed } from '@ember/object';
import { observer } from '@ember/object';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

/**
* TODO
*
* @class Visualization-Controller
* @extends Ember.Controller
*
* @module explorviz
* @submodule visualization
*/
export default Controller.extend(AlertifyHandler, {

  urlBuilder: service("url-builder"),
  viewImporter: service("view-importer"),
  reloadHandler: service("reload-handler"),
  renderingService: service("rendering-service"),
  landscapeRepo: service("repos/landscape-repository"),

  state: null,

  // Specify query parameters
  queryParams: ['timestamp', 'appID', 'camX', 'camY', 'camZ', 'condition'],

  type: 'landscape',

  // query parameter serialized into strings
  timestamp: null,
  appID: null,
  camX: null,
  camY: null,
  camZ: null,
  condition: null,

  observer: observer('viewImporter.importedURL', function() {
    if(!this.get('viewImporter.importedURL')) {
      this.set('timestamp',null);
      this.set('appID',null);
      this.set('camX',null);
      this.set('camY',null);
      this.set('camZ',null);
      this.set('condition',[]);
    }
  }),

  showLandscape: computed('landscapeRepo.latestApplication', function() {
    return !this.get('landscapeRepo.latestApplication');
  }),

  actions: {

    resetView() {
      this.set('viewImporter.importedURL', false);
      this.get('renderingService').reSetupScene();
      this.get('reloadHandler').startExchange();
    }
    
  },

  showTimeline() {
    this.set('renderingService.showTimeline', true);
  },

  hideVersionbar(){
    this.set('renderingService.showVersionbar', false);
  },

  // @Override
  init() {
    this._super(...arguments);

    const self = this;

    this.set('condition', []);

    // setup url-builder Service
    this.get('urlBuilder').on('transmitState', function(state) {
      self.set('state',state);
    });

    // Listen for component request
    this.get('viewImporter').on('requestView', function() {
      const newState = {};
      // Get and convert query params

      newState.timestamp = self.get('timestamp');
      newState.appID = self.get('appID');

      newState.camX = parseFloat(self.get('camX'));
      newState.camY = parseFloat(self.get('camY'));
      newState.camZ = parseFloat(self.get('camZ'));
      newState.condition = self.get('condition');

      // Passes the new state from controller via service to component
      self.get('viewImporter').transmitView(newState);
    });
  },

  // @Override
  cleanup() {
    this._super(...arguments);
    this.get('urlBuilder').off('transmitState');
    this.get('viewImporter').off('requestView');
  },

  // Closure action for components
  // Passed via template
  clickedEntity(emberRecord) {
    this.debug("clicked", emberRecord);
  },

  // Closure action for components
  // Passed via template
  doubleClickedEntity(emberModel) {

    const emberModelName = emberModel.constructor.modelName;

    if(emberModelName === "application"){

      if(emberModel.get('components').get('length') === 0) {
        // no data => show message

        const message = "Sorry, there is no information for application <b>" + emberModel.get('name') +
          "</b> available.";

        this.showAlertifyMessage(message);

      } else {
        // data available => open application-rendering
        this.closeAlertifyMessages();
        
        
        // show application
        this.set('viewImporter.importedURL', null);
        this.set('landscapeRepo.latestApplication', emberModel);
        this.set('landscapeRepo.replayApplication', emberModel);
      }
    }
    else if (emberModelName === "nodegroup" || emberModelName === "system"){
      emberModel.setOpened(!emberModel.get('opened'));
      this.get('renderingService').redrawScene();
    }
    else if(emberModelName === "component"){
      emberModel.setOpenedStatus(!emberModel.get('opened'));
      emberModel.set('highlighted', false);
      this.get('renderingService').redrawScene();
    }
  }
  
});
