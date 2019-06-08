import Object, { computed } from '@ember/object';
import Evented from '@ember/object/evented';
import { inject as service } from "@ember/service";
import { getOwner } from '@ember/application';

import HammerInteraction from 'explorviz-frontend/utils/hammer-interaction';
import PopUpHandler from
  'explorviz-frontend/utils/application-rendering/popup-handler';
import Raycaster from 'explorviz-frontend/utils/raycaster';
import HoverHandler from 'explorviz-frontend/utils/hover-effect-handler';
export default Object.extend(Evented, {

  canvas: null,
  camera: null,
  renderer: null,
  raycaster: null,
  rotationObject: null,
  hammerHandler: null,
  popUpHandler: null,
  highlighter: service('visualization/application/highlighter'),
  hoverHandler: null,
  renderingService: service(),

  currentUser: service(),

  raycastObjects: computed('rotationObject', function() {
    return this.get('rotationObject.children');
  }),

  setupInteraction(canvas, camera, renderer, parentObject) {
    this.set('canvas', canvas);
    this.set('camera', camera);
    this.set('renderer', renderer);
    this.set('rotationObject', parentObject);

    const self = this;

    // mouseout handler for disabling notifications
    canvas.addEventListener('mouseout', registerMouseOut, false);

    function registerMouseOut(evt) {
      self.onMouseOut(evt);
    }

    // mouseenter handler for disabling notifications
    canvas.addEventListener('mouseenter', registerMouseEnter, false);

    function registerMouseEnter(evt) {
      self.onMouseEnter(evt);
    }

    // zoom handler
    canvas.addEventListener('mousewheel', registerMouseWheel, false);

    // zoom handler (firefox)
    canvas.addEventListener('DOMMouseScroll', registerMouseWheel, false);

    function registerMouseWheel(evt) {
      self.onMouseWheelStart(evt);
    }

    // hover handler
    canvas.addEventListener('mousemove', registerMouseMove, false);

    function registerMouseMove(evt) {
      self.onMouseMove(evt);
    }

    // init Hammer
    this.set('hammerHandler', HammerInteraction.create());
    this.get('hammerHandler').setupHammer(canvas);

    if (!this.get('raycaster')) {
      this.set('raycaster', Raycaster.create());
      this.set('raycaster.objectCatalog', 'applicationObjects');
    }

    // init PopUpHandler
    if (!this.get('popUpHandler')) {
      this.set('popUpHandler', PopUpHandler.create(getOwner(this).ownerInjection()));
    }

    // init HoverHandler
    if (!this.get('hoverHandler')) {
      this.set('hoverHandler', HoverHandler.create(getOwner(this).ownerInjection()));
    }

    this.registerPopUpHandler();
    this.setupHammerListener();

  },


  onMouseMove(evt) {

    const rect = this.get('canvas').getBoundingClientRect();

    const mouse = {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };

    const origin = {};

    origin.x = (mouse.x / this.get('renderer').domElement.clientWidth) * 2 - 1;

    origin.y = -(mouse.y / this.get('renderer').domElement.clientHeight) * 2 + 1;

    const intersectedViewObj = this.get('raycaster').raycasting(null, origin,
      this.get('camera'), this.get('raycastObjects'));

    this.get('hoverHandler').handleHoverEffect(intersectedViewObj);

  },


  onMouseWheelStart(evt) {

    // Hide (old) tooltip
    this.get('popUpHandler').hideTooltip();

    var delta = Math.max(-1, Math.min(1, (evt.wheelDelta || -evt.detail)));

    // zoom in
    if (delta > 0) {
      this.get('camera').position.z -= delta * 3.5;
    }
    // zoom out
    else {
      this.get('camera').position.z -= delta * 3.5;
    }
  },


  onMouseOut() {
    this.set('popUpHandler.enableTooltips', false);
    this.get('popUpHandler').hideTooltip();
  },


  onMouseEnter() {
    this.set('popUpHandler.enableTooltips', true);
  },


  setupHammerListener() {

    const self = this;

    this.get('hammerHandler').on('doubletap', function(mouse) {
      self.handleDoubleClick(mouse);
    });

    this.get('hammerHandler').on('panning', function(delta, event) {
      self.handlePanning(delta, event);
    });

    this.get('hammerHandler').on('singletap', function(mouse) {
      self.handleSingleClick(mouse);
    });

  },


  registerPopUpHandler() {

    const self = this;

    // custom event for mousemovement end
    (function (delay) {
        var timeout;
        self.get('canvas').addEventListener('mousemove', function (evt) {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
              var event = new CustomEvent("mousestop", {
                  detail: {
                      clientX: evt.clientX,
                      clientY: evt.clientY
                  },
                  bubbles: true,
                  cancelable: true
              });
              evt.target.dispatchEvent(event);
            }, delay);

            // When moving, hide (old) tooltip
            self.get('popUpHandler').hideTooltip();
        });
    })(300);


    this.get('canvas').addEventListener('mousestop', registerPopUpHandler, false);

    function registerPopUpHandler(evt) {
      self.handlePopUp(evt);
    }
  },


  updateEntities(app) {
    this.set('rotationObject', app);
    this.set('highlighter.application', app.userData.model);
  },


  removeHandlers() {
    this.get('hammerHandler.hammerManager').off();
    this.get('canvas').removeEventListener('mousewheel', this.onMouseWheelStart);
    this.get('canvas').removeEventListener('mousestop', this.handlePopUp);
  },


  // Handler


  handleDoubleClick(mouse) {

    const origin = {};

    const rect = this.get('canvas').getBoundingClientRect();

    const mouseOnCanvas = {
      x: mouse.x - rect.left,
      y: mouse.y - rect.top
    };

    origin.x = (mouseOnCanvas.x / this.get('renderer').domElement.clientWidth) * 2 - 1;

    origin.y = -(mouseOnCanvas.y / this.get('renderer').domElement.clientHeight) * 2 + 1;

    const intersectedViewObj = this.get('raycaster').raycasting(null, origin,
      this.get('camera'), this.get('raycastObjects'));

    let emberModel;

    if(intersectedViewObj) {

      // Hide (old) tooltip
      this.get('popUpHandler').hideTooltip();

      emberModel = intersectedViewObj.object.userData.model;
      const emberModelName = emberModel.constructor.modelName;

      if(emberModelName === "component"){
        emberModel.setOpenedStatus(!emberModel.get('opened'));

        let keepHighlightingOnOpenOrClose = this.get('currentUser').getPreferenceOrDefaultValue('flagsetting', 'keepHighlightingOnOpenOrClose');

        if(!keepHighlightingOnOpenOrClose) {
          const highlighted = this.get('highlighter.highlightedEntity');
  
          if(emberModel === highlighted || emberModel.contains(highlighted)) {
            this.get('highlighter').unhighlightAll();
          }
        }

        this.get('highlighter').applyHighlighting();
        this.get('renderingService').redrawScene();
      } 
    }

    this.trigger('doubleClick', emberModel);

  },


  handleSingleClick(mouse) {

    const origin = {};

    const rect = this.get('canvas').getBoundingClientRect();

    const mouseOnCanvas = {
      x: mouse.x - rect.left,
      y: mouse.y - rect.top
    };

    origin.x = (mouseOnCanvas.x / this.get('renderer').domElement.clientWidth) * 2 - 1;

    origin.y = -(mouseOnCanvas.y / this.get('renderer').domElement.clientHeight) * 2 + 1;

    const intersectedViewObj = this.get('raycaster').raycasting(null, origin,
      this.get('camera'), this.get('raycastObjects'));

    let emberModel;

    if(intersectedViewObj) {

      // Hide (old) tooltip
      this.get('popUpHandler').hideTooltip();

      emberModel = intersectedViewObj.object.userData.model;
      const emberModelName = emberModel.constructor.modelName;

      if(emberModelName === "component" && emberModel.get('foundation') === false ||
         emberModelName === "clazz" || 
         emberModelName === "drawableclazzcommunication"){

        this.get('highlighter').highlight(emberModel);
      }

      this.get('renderingService').redrawScene();

    }
    else {
      if(this.get('highlighter.highlightedEntity')) {
        // clicked in white space and entity is highlighted
        this.get('highlighter').unhighlightAll();
        this.get('renderingService').redrawScene();
      }
    }

    this.trigger('singleClick', emberModel);
  },

  handlePanning(delta, event) {

    if(event.button === 3) {
      // rotate object
      this.get('rotationObject').rotation.x += delta.y / 100;
      this.get('rotationObject').rotation.y += delta.x / 100;
    }

    else if(event.button === 1){
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

  },


  handlePopUp(evt) {

    const rect = this.get('canvas').getBoundingClientRect();

    const mouse = {
      x: evt.detail.clientX - rect.left,
      y: evt.detail.clientY - rect.top
    };

    const origin = {};

    origin.x = (mouse.x / this.get('renderer').domElement.clientWidth) * 2 - 1;

    origin.y = -(mouse.y / this.get('renderer').domElement.clientHeight) * 2 + 1;

    const intersectedViewObj = this.get('raycaster').raycasting(null, origin,
      this.get('camera'), this.get('raycastObjects'));

    if(intersectedViewObj) {

      const emberModel = intersectedViewObj.object.userData.model;

      this.get('popUpHandler').showTooltip(
        mouse,
        emberModel
      );

    }

  }
});
