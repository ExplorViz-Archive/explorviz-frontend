import Ember from 'ember';

export default Ember.Object.extend(Ember.Evented, {

  camera: null,
  renderer: null,
  raycaster: null,
  raycastObjects: null,

  setupInteraction(canvas, camera, renderer, raycaster, raycastObjects) {
    this.set('camera', camera);
    this.set('renderer', renderer);
    this.set('raycaster', raycaster);
    this.set('raycastObjects', raycastObjects);

    // zoom handler    
    canvas.addEventListener('mousewheel', onMouseWheelStart, false);

    function onMouseWheelStart(evt) {

      var delta = Math.max(-1, Math.min(1, (evt.wheelDelta || -evt.detail)));

      // zoom in
      if (delta > 0) {
        camera.position.z -= delta * 1.5;
      }
      // zoom out
      else {
        camera.position.z -= delta * 1.5;
      }
    }
  },

  handleDoubleClick(mouse) {

    const origin = {};

    origin.x = ((mouse.x - (this.get('renderer').domElement.offsetLeft+0.66)) / 
      this.get('renderer').domElement.clientWidth) * 2 - 1;

    origin.y = -((mouse.y - (this.get('renderer').domElement.offsetTop+0.665)) / 
      this.get('renderer').domElement.clientHeight) * 2 + 1;

    const intersectedViewObj = this.get('raycaster').raycasting(null, origin, 
      this.get('camera'), this.get('raycastObjects'));

    if(intersectedViewObj) {

      const emberModel = intersectedViewObj.object.userData.model;
      const emberModelName = emberModel.constructor.modelName;

      if(emberModelName === "application"){
        // open application-rendering
        this.trigger('showApplication', emberModel);
      } 
      else if (emberModelName === "nodegroup" || emberModelName === "system"){
        emberModel.setOpened(!emberModel.get('opened'));
        this.trigger('redrawScene');
      }
      else if(emberModelName === "component"){
        emberModel.setOpenedStatus(!emberModel.get('opened'));
        emberModel.set('highlighted', false);
        this.trigger('redrawScene');
      } 

    }

  },

  handlePanning(delta, event) {
    if(event.button === 1){
      // translate camera

      var distanceXInPercent = (delta.x /
      parseFloat(this.get('renderer').domElement.clientWidth)) * 100.0;

      var distanceYInPercent = (delta.y /
        parseFloat(this.get('renderer').domElement.clientHeight)) * 100.0;

      var xVal = this.get('camera').position.x + distanceXInPercent * 6.0 * 0.015 * -(Math.abs(this.get('camera').position.z) / 4.0);

      var yVal = this.get('camera').position.y + distanceYInPercent * 4.0 * 0.01 * (Math.abs(this.get('camera').position.z) / 4.0);

      this.get('camera').position.x = xVal;
      this.get('camera').position.y = yVal;
    }
  }





});