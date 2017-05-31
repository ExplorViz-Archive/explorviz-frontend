import Ember from 'ember';

export default Ember.Controller.extend({

  urlBuilder: Ember.inject.service("url-builder"),

  // Specify query parameters
  queryParams: ['timestamp', 'id', 'appName', 'cameraX', 'cameraY', 'cameraZ'],

  type: 'landscape',
  id: null,
  appName: null,
  cameraX: null,
  cameraY: null,
  cameraZ: null,
  timestamp: null,

  showLandscape: true,
  lastShownApplication: null,
  state: null,
  
  //@override
  // Initialize service
  init() {
    const self = this;

    this.get('urlBuilder').on('transmitState', function(state) {
      self.set('state',state);
    });
  },

  actions: {
  	// triggered by the button implemented in visualization tamplate
  	exportState: function() {
        // Update query parameters
        this.get('urlBuilder').requestURL();
        this.set('cameraX', this.get('state').cameraX);
        this.set('cameraY', this.get('state').cameraY);
        this.set('cameraZ', this.get('state').cameraZ);
        this.set('timestamp', this.get('model.timestamp'));
        this.set('id', this.get('model.id'));
    }
  }
});