import Ember from 'ember';

export default Ember.Controller.extend({

  urlBuilder: Ember.inject.service("url-builder"),
  viewImporter: Ember.inject.service("view-importer"),
  reloadHandler: Ember.inject.service("reload-handler"), 

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
  
  // @Override
  init() {
    const self = this;

    // setup url-builder Service
    this.get('urlBuilder').on('transmitState', function(state) {
      self.set('state',state);
    });

    Ember.$(window).on('onbeforeunload', function() {
      window.history.replaceState( {} , 'foo', '/foo' );
      console.log("lol");
      self.cleanupQueryParams();
    });

    Ember.$('body').on('beforeunload',function(){
     console.log("lol");
     self.cleanupQueryParams();
    });

  },

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

    // clean up boolean after leaving application
    hideApplication: function(){
      this.set('showLandscape',true);
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

    // Triggered by the button implemented in visualization template
    exportState: function() {
        // Pause timeshift
        this.get('reloadHandler').stopExchange();
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