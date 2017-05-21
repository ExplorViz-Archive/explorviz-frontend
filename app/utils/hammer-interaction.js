import Ember from 'ember';
import Hammer from "npm:hammerjs";

export default Ember.Object.extend(Ember.Evented, {

  setupInteractionHandlers(canvas, raycastObjects, camera, renderer, raycaster) {

    const self = this;

    let cameraTranslateX, cameraTranslateY = 0;

    console.log(camera);

    const hammer = new Hammer.Manager(canvas, {});

    const singleTap = new Hammer.Tap({
      event: 'singletap',
      interval: 250
    });

    const doubleTap = new Hammer.Tap({
      event: 'doubletap',
      taps: 2,
      interval: 250
    });

    const pan = new Hammer.Pan({
      event: 'pan'
    });

    hammer.add([doubleTap, singleTap, pan]);

    doubleTap.recognizeWith(singleTap);
    singleTap.requireFailure(doubleTap);

    hammer
      .on(
        'doubletap',
        function(evt) {

          var mouse = {};

          const event = evt.srcEvent;

          mouse.x = ((event.clientX - (renderer.domElement.offsetLeft+0.66)) / renderer.domElement.clientWidth) * 2 - 1;
          mouse.y = -((event.clientY - (renderer.domElement.offsetTop+0.665)) / renderer.domElement.clientHeight) * 2 + 1;

          const intersectedViewObj = raycaster.raycasting(null, mouse, camera, raycastObjects, 'landscapeObjects');

          if(intersectedViewObj) {

            const emberModel = intersectedViewObj.object.userData.model;
            const emberModelName = emberModel.constructor.modelName;

            //self.debug("Name of raycasting goal: ", emberModelName);

            if(emberModelName === "application"){
              // open application-rendering
              self.trigger('showApplication', emberModel);
            } 
            else if (emberModelName === "nodegroup" || emberModelName === "system"){
              emberModel.setOpened(!emberModel.get('opened'));
              self.trigger('cleanup');
            } 
          }
    });

    hammer.on('panstart', function(evt) {
      const event = evt.srcEvent;

      cameraTranslateX = event.clientX;
      cameraTranslateY = event.clientY;
    });

    hammer.on('panmove', function(evt) {

      const event = evt.srcEvent;

      var deltaX = event.clientX - cameraTranslateX;
      var deltaY = event.clientY - cameraTranslateY;

      var distanceXInPercent = (deltaX /
        parseFloat(renderer.domElement.clientWidth)) * 100.0;

      var distanceYInPercent = (deltaY /
        parseFloat(renderer.domElement.clientHeight)) * 100.0;

      var xVal = camera.position.x + distanceXInPercent * 6.0 * 0.015 * -(Math.abs(camera.position.z) / 4.0);

      var yVal = camera.position.y + distanceYInPercent * 4.0 * 0.01 * (Math.abs(camera.position.z) / 4.0);

      camera.position.x = xVal;
      camera.position.y = yVal;

      cameraTranslateX = event.clientX;
      cameraTranslateY = event.clientY;
    });

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

  }

});