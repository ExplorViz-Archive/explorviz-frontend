import Ember from 'ember';


export default Ember.Object.extend(Ember.Evented, {

  // Declare url-builder service 
  /*urlBuilderService: Ember.inject.service("url-builder"),

  camera: null,	

    setupService(camera) {
  	const self = this;
    this.set('camera', camera);
    console.log("---- Positions ---->");
    console.log(camera.position.x);
    console.log(camera.position.y);
    console.log(camera.position.z);
    

    self.get('urlBuilderService').on('requestURL', function() {
      console.log("function");
      const state = {};
      state.cameraX = self.get('camera').position.x; 
      state.cameraY = self.get('camera').position.y; 
      state.cameraZ = self.get('camera').position.z; 
      state.timestamp = self.get('model.timestamp');
      state.id = self.get('model.id');
      // Passes the state from component via service to controller
      self.get('urlBuilderService').transmitState(state);
    });
    
  },

  removeService() {
    //this.get('urlBuilderService').off();
  },*/




  





});