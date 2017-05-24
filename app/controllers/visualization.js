import Ember from 'ember';

export default Ember.Controller.extend({

  urlBuilder: Ember.inject.service("url-builder"),

  //specify query parameters
  queryParams: ['timestamp', 'id', 'appName', 'cameraX', 'cameraY', 'cameraZ'],

  type: 'landscape',
  id: null,
  appName: null,
  cameraX: null,
  cameraY: null,
  cameraZ: null,
  camera: null,
  timestamp: null,

  showLandscape: true,
  lastShownApplication: null,
  
  //@override
  init() {
    this.get('urlBuilder').on('test2', function(state) {
      console.log(state);
    });
  },



  actions: {
  	// triggered by the button implemented in visualization tamplate
  	exportView: function() {
  		  /*this.set('timestamp', this.get('model.timestamp')),
  		  this.set('id', this.get('model.id')),
 		    this.set('cameraX', 22),
      	this.set('cameraY', 33);
      	this.set('cameraZ', 44);
        */
        this.get('urlBuilder').requestURL();

    }
  }
});