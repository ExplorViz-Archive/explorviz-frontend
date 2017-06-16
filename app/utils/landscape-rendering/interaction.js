import Ember from 'ember';
import HammerInteraction from '../hammer-interaction';
import HoverHandler from './hover-handler';
import AlertifyHandler from 'explorviz-ui-frontend/mixins/alertify-handler';

export default Ember.Object.extend(Ember.Evented, AlertifyHandler, {

  canvas: null,
  camera: null,
  renderer: null,
  raycaster: null,
  raycastObjects: null,

  hammerHandler: null,
  hoverHandler: null,

  setupInteraction(canvas, camera, renderer, raycaster, raycastObjects) {
    this.set('canvas', canvas);
    this.set('camera', camera);
    this.set('renderer', renderer);
    this.set('raycaster', raycaster);
    this.set('raycastObjects', raycastObjects);

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

    function registerMouseWheel(evt) {
      self.onMouseWheelStart(evt);
    }

    // init Hammer
    if (!this.get('hammerHandler')) {
      this.set('hammerHandler', HammerInteraction.create());
      this.get('hammerHandler').setupHammer(canvas);
    }

    // init HoverHandler
    if (!this.get('hoverHandler')) {
      this.set('hoverHandler', HoverHandler.create());
    }

    // hover handler
    self.registerHoverHandler();

    this.setupHammerListener();
    
  },

  onMouseWheelStart(evt) {

    // Hide (old) tooltip
    this.get('hoverHandler').hideTooltip();

    var delta = Math.max(-1, Math.min(1, (evt.wheelDelta || -evt.detail)));

    // zoom in
    if (delta > 0) {
      this.get('camera').position.z -= delta * 1.5;
    }
    // zoom out
    else {
      this.get('camera').position.z -= delta * 1.5;
    }
  },


  onMouseOut() {
    this.set('hoverHandler.enableTooltips', false);
    this.get('hoverHandler').hideTooltip();
  },


  onMouseEnter() {
    this.set('hoverHandler.enableTooltips', true);
  },


  setupHammerListener() {

    const self = this;

    this.get('hammerHandler').on('doubleClick', function(mouse) {
      self.handleDoubleClick(mouse);
    });

    this.get('hammerHandler').on('panning', function(delta, event) {
      self.handlePanning(delta, event);
    });

    this.get('hammerHandler').on('panningEnd', function(mouse) {
      self.handleHover(mouse);
    });

  },

  registerHoverHandler() {

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
            self.get('hoverHandler').hideTooltip();
        });
    })(300);

    
    this.get('canvas').addEventListener('mousestop', registerHoverHandler, false);

    function registerHoverHandler(evt) {
      self.handleHover(evt);
    }
  },


  removeHandlers() {
    this.get('hammerHandler.hammerManager').off();
    this.get('canvas').removeEventListener('mousewheel', this.onMouseWheelStart);
    this.get('canvas').removeEventListener('mousestop', this.handleHover);
    this.get('canvas').removeEventListener('mouseenter', this.onMouseEnter);
    this.get('canvas').removeEventListener('mouseout', this.onMouseOut);
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

      // hide tooltip
      this.get('hoverHandler').hideTooltip();

      const emberModel = intersectedViewObj.object.userData.model;
      const emberModelName = emberModel.constructor.modelName;
      
      if(emberModelName === "application"){

        if(emberModel.get('components').get('length') === 0) {
          // no data => show message

          const message = "Sorry, no details for <b>" + emberModel.get('name') + 
            "</b> are available.";

          this.showAlertifyMessage(message);

        } else {
          // data available => open application-rendering
          this.closeAlertifyMessages();
          this.trigger('showApplication', emberModel);
        }

        
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
  },


  handleHover(evt) {

    const mouse = {
      x: evt.detail.clientX,
      y: evt.detail.clientY
    };

    const origin = {};

    origin.x = ((mouse.x - (this.get('renderer').domElement.offsetLeft+0.66)) / 
      this.get('renderer').domElement.clientWidth) * 2 - 1;

    origin.y = -((mouse.y - (this.get('renderer').domElement.offsetTop+0.665)) / 
      this.get('renderer').domElement.clientHeight) * 2 + 1;

    const intersectedViewObj = this.get('raycaster').raycasting(null, origin, 
      this.get('camera'), this.get('raycastObjects'));

    if(intersectedViewObj) {

      const emberModel = intersectedViewObj.object.userData.model;

      this.get('hoverHandler').showTooltip(mouse, emberModel);

    }

  }





});