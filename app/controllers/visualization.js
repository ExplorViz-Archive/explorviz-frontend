import Ember from 'ember';

export default Ember.Controller.extend({

  urlBuilder: Ember.inject.service("url-builder"),
  viewImporter: Ember.inject.service("view-importer"),
  reloadHandler: Ember.inject.service("reload-handler"),
  renderingService: Ember.inject.service(),

  // Specify query parameters
  queryParams: ['timestamp', 'appID', 'camX', 'camY', 'camZ'],

  type: 'landscape',

  // query parameter serialized into strings
  timestamp: null,
  appID: null,
  camX: null,
  camY: null,
  camZ: null,

  showLandscape: true,
  lastShownApplication: null,
  state: null,
  
  // @Override
  init() {
    const self = this;

    // setup url-builder Service
    this.get('urlBuilder').on('transmitState', function(state) {
      self.set('state',state);
    });
  },

  // reset query parameters
  cleanupQueryParams(){
    this.set('timestamp',null);
    this.set('appID',null);
    this.set('camX',null);
    this.set('camY',null);
    this.set('camZ',null);  
  },

  actions: {

    resetQueryParams(){
      this.cleanupQueryParams();
    },

    // clean up boolean after leaving application
    hideApplication(){
      this.set('showLandscape',true);
    },

    setupService(){
      const self = this;
      // Listen for component request 
      self.get('viewImporter').on('requestView', function() {
        const newState = {};
        // Get and convert query params
        
        newState.timestamp = self.get('timestamp');
        newState.appID = self.get('appID'); 
        
        newState.camX = parseFloat(self.get('camX'));
        newState.camY = parseFloat(self.get('camY'));
        newState.camZ = parseFloat(self.get('camZ'));

        // Passes the new state from controller via service to component
        self.get('viewImporter').transmitView(newState);
      });
    },

    // Triggered by the export button 
    exportState() {
        // Pause timeshift
        this.get('reloadHandler').stopExchange();
        // Update query parameters
        this.get('urlBuilder').requestURL();

        this.set('timestamp', this.get('state').timestamp);
        this.set('appID', this.get('state').appID);

        this.set('camX', this.get('state').camX);
        this.set('camY', this.get('state').camY);
        this.set('camZ', this.get('state').camZ);

    },

    removeQueryParams() {
      this.set('timestamp', null);
      this.set('appID', null);

      this.set('camX', null);
      this.set('camY', null);
      this.set('camZ', null);

      this.set('viewImporter.importedURL', false);
      this.get('renderingService').reSetupScene();
      this.get('reloadHandler').startExchange();
    }


  }
});