import Ember from 'ember';
import Hammer from "npm:hammerjs";

export default Ember.Object.extend(Ember.Evented, {

  raycastObjects: null,
  hammerManager: null,

  setupInteractionHandlers(canvas, raycastObjects, camera, renderer, raycaster) {

    const self = this;

    this.set('raycastObjects', raycastObjects);

    let mouseDeltaX, mouseDeltaY = 0;

    registerRightClickWithPan();    

    const hammer = new Hammer.Manager(canvas, {});

    this.set('hammerManager', hammer);

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

          if(evt.button !== 1) {
            return;
          }

          var mouse = {};

          const event = evt.srcEvent;

          mouse.x = ((event.clientX - (renderer.domElement.offsetLeft+0.66)) / renderer.domElement.clientWidth) * 2 - 1;
          mouse.y = -((event.clientY - (renderer.domElement.offsetTop+0.665)) / renderer.domElement.clientHeight) * 2 + 1;

          const intersectedViewObj = raycaster.raycasting(null, mouse, camera, self.get('raycastObjects'));

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
            else if(emberModelName === "component"){
              emberModel.setOpenedStatus(!emberModel.get('opened'));
              emberModel.set('highlighted', false);
              self.trigger('cleanup');
            } 

          }
    });

    hammer.on('panstart', function(evt) {

      if(evt.button !== 1 && evt.button !== 3) {
        return;
      }

      const event = evt.srcEvent;

      mouseDeltaX = event.clientX;
      mouseDeltaY = event.clientY;
    });

    hammer.on('panmove', function(evt) {

      if(evt.button !== 1 && evt.button !== 3) {
        return;
      }

      const event = evt.srcEvent;

      var deltaX = event.clientX - mouseDeltaX;
      var deltaY = event.clientY - mouseDeltaY;

      if(evt.button === 3) {
        // rotate object
        self.trigger('rotateApplication', deltaX / 100, deltaY / 100);
      } else if(evt.button === 1){
        // translate camera
        var distanceXInPercent = (deltaX /
        parseFloat(renderer.domElement.clientWidth)) * 100.0;

        var distanceYInPercent = (deltaY /
          parseFloat(renderer.domElement.clientHeight)) * 100.0;

        var xVal = camera.position.x + distanceXInPercent * 6.0 * 0.015 * -(Math.abs(camera.position.z) / 4.0);

        var yVal = camera.position.y + distanceYInPercent * 4.0 * 0.01 * (Math.abs(camera.position.z) / 4.0);

        camera.position.x = xVal;
        camera.position.y = yVal;
      }     

      mouseDeltaX = event.clientX;
      mouseDeltaY = event.clientY;

    });


    hammer.on('singletap', function(evt){

      if(evt.button !== 1) {
        return;
      }

      var mouse = {};
      
      const event = evt.srcEvent;

      mouse.x = ((event.clientX - (renderer.domElement.offsetLeft+0.66)) / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - (renderer.domElement.offsetTop+0.665)) / renderer.domElement.clientHeight) * 2 + 1;

      const intersectedViewObj = raycaster.raycasting(null, mouse, camera, self.get('raycastObjects'));

      if(intersectedViewObj) {

        const emberModel = intersectedViewObj.object.userData.model;
        const emberModelName = emberModel.constructor.modelName;

        if(emberModelName === "component" && !emberModel.get('opened')){

          emberModel.set('highlighted', !emberModel.get('highlighted'));    
        } 
        else if(emberModelName === "clazz") {
          emberModel.set('highlighted', !emberModel.get('highlighted'));
        }

        self.trigger('cleanup');

      }

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


    function registerRightClickWithPan() {

      const POINTER_INPUT_MAP = {
        pointerdown: Hammer.INPUT_START,
        pointermove: Hammer.INPUT_MOVE,
        pointerup: Hammer.INPUT_END,
        pointercancel: Hammer.INPUT_CANCEL,
        pointerout: Hammer.INPUT_CANCEL
      };

      Hammer.inherit(Hammer.PointerEventInput, Hammer.Input, {

        handler: function PEhandler(ev) {

          var store = this.store;
          var removePointer = false;

          var eventTypeNormalized = ev.type.toLowerCase();
          var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
          var pointerType = ev.pointerType;

          //modified to handle all buttons
          //left=0, middle=1, right=2
          if (eventType & Hammer.INPUT_START) {
              //firefox sends button 0 for mousemove, so store it here
              this.button = ev.button;
          }

          var isTouch = (pointerType === Hammer.INPUT_TYPE_TOUCH);

          function isCorrectPointerId(element) {
            return element.pointerId === ev.pointerId;
          }

          // get index of the event in the store
          var storeIndex = store.findIndex(isCorrectPointerId);

          // start and mouse must be down
          if (eventType & Hammer.INPUT_START && (ev.button === 0 || ev.button === 1 || ev.button === 2 || isTouch)) {
              if (storeIndex < 0) {
                  store.push(ev);
                  storeIndex = store.length - 1;
              }
          } else if (eventType & (Hammer.INPUT_END | Hammer.INPUT_CANCEL)) {
              removePointer = true;
          }

          // it not found, so the pointer hasn't been down (so it's probably a hover)
          if (storeIndex < 0) {
              return;
          }

          // update the event in the store
          store[storeIndex] = ev;

          this.callback(this.manager, eventType, {
              button: this.button +1,
              pointers: store,
              changedPointers: [ev],
              pointerType: pointerType,
              srcEvent: ev
          });

          if (removePointer) {
              // remove from the store
              store.splice(storeIndex, 1);
          }
        }
      });

    }
  }

});