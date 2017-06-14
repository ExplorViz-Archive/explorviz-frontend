import Ember from 'ember';

export default Ember.Controller.extend({

  urlBuilder: Ember.inject.service("url-builder"),
  viewImporter: Ember.inject.service("view-importer"),

  // Specify query parameters
  queryParams: ['timestamp', 'id', 'appName', 'cameraX', 'cameraY', 'cameraZ', 'showApp'],

  type: 'landscape',

  // query parameter serialized into strings
  id: null,
  appName: null,
  cameraX: null,
  cameraY: null,
  cameraZ: null,
  showApp: null,
  timestamp: null,

  showLandscape: true,
  lastShownApplication: null,
  state: null,
  
  //@override
  // Initialize service
  init() {
    const self = this;
    // setup url-builder Service
    this.get('urlBuilder').on('transmitState', function(state) {
      self.set('state',state);
    });
  },

  /**
  This method is used to reset all query parameters
  */
  cleanupQueryParams(){
    this.set('id',null);
    this.set('appName',null);
    this.set('timestamp',null);
    this.set('cameraX',null);
    this.set('cameraY',null);
    this.set('cameraZ',null); 
    this.set('showApp',null);    
  },

  actions: {

    resetQueryParams: function(){
      this.cleanupQueryParams();
    },

    setupService: function(){
      const self = this;
      // Listen for component request 
      self.get('viewImporter').on('requestView', function() {
        let newState = {};
        // Get and convert query params
        newState.cameraX = parseFloat(self.get('cameraX'));
        newState.cameraY = parseFloat(self.get('cameraY'));
        newState.cameraZ = parseFloat(self.get('cameraZ'));
        newState.timestamp = self.get('model.timestamp');
        newState.id = self.get('model.id');
        // Passes the new state from controller via service to component
        self.get('viewImporter').transmitView(newState);
      });
    },

    // triggered by the button implemented in visualization tamplate
    exportState: function() {
        // Update query parameters
        this.get('urlBuilder').requestURL();
        this.set('cameraX', this.get('state').cameraX);
        this.set('cameraY', this.get('state').cameraY);
        this.set('cameraZ', this.get('state').cameraZ);
        this.set('timestamp', this.get('model.timestamp'));
        this.set('id', this.get('model.id'));
        this.set('showApp', !this.get('showLandscape'));
    }
  }
});