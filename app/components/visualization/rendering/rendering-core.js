import Ember from 'ember';
import THREE from "npm:three";
import config from 'explorviz-frontend/config/environment';
import THREEPerformance from 'explorviz-frontend/mixins/threejs-performance';

const {Component, inject, Evented} = Ember;

/**
* This component contains the core mechanics of the different (three.js-based)
* renderer. All functions below are called in a determined order, hence you only
* need to override them in your custom renderer.
*
* See {{#crossLink "Landscape-Rendering"}}{{/crossLink}} or
* {{#crossLink "Application-Rendering"}}{{/crossLink}} for example usage.
*
* Call order:
*
* 1.
*
* @class Rendering-Core-Component
* @extends Ember.Component
*
* @module explorviz
* @submodule visualization.rendering
*/
export default Component.extend(Evented, THREEPerformance, {

  state: null,

  // Declare url-builder service
  urlBuilder: inject.service("url-builder"),

  // Declare view-importer service
  viewImporter: inject.service("view-importer"),

  reloadHandler: inject.service("reload-handler"),
  landscapeRepo: inject.service("repos/landscape-repository"),
  renderingService: inject.service(),

  classNames: ['viz'],

  scene : null,
  webglrenderer: null,
  camera: null,

  canvas: null,

  font: null,
  animationFrameId: null,

  initDone: false,

  appCondition: [],
  initImport: true,


  // @Override
  /**
   * This overridden Ember Component lifecycle hook enables calling
   * ExplorViz's setup code for actual rendering and custom listeners.
   *
   * @method didRender
   */
  didRender(){
    this._super(...arguments);
    this.initRendering();
    this.initListener();
  },


  // @Override
  /**
   * This overridden Ember Component lifecycle hook enables calling
   * ExplorViz's custom cleanup code.
   *
   * @method willDestroyElement
   */
  willDestroyElement() {
    this._super(...arguments);
    this.cleanup();
  },


  /**
   * This function is called once on the didRender event. Inherit this function
   * to call other important function, e.g. "initInteraction" as shown in
   * {{#crossLink "Landscape-Rendering/initInteraction:method"}}{{/crossLink}}.
   *
   * @method initRendering
   */
  initRendering() {

    this.debug('init rendering-core');

    const self = this;

    // get size if outer ember div
    const height = this.$()[0].clientHeight;
    const width = this.$()[0].clientWidth;

    const canvas = this.$('#threeCanvas')[0];

    this.set('canvas', canvas);

    this.set('scene', new THREE.Scene());
    this.set('scene.background', new THREE.Color(0xffffff));

    this.set('camera', new THREE.PerspectiveCamera(75, width / height, 0.1, 1000));

    this.set('webglrenderer', new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas
    }));
    this.get('webglrenderer').setPixelRatio(window.devicePixelRatio);
    this.get('webglrenderer').setSize(width, height);

    // Rendering loop //
    function render() {
      const animationId = requestAnimationFrame(render);
      self.set('animationFrameId', animationId);

      if(config.environment === "development" || config.environment === "akr") {
        self.get('threexStats').update(self.get('webglrenderer'));
        self.get('stats').begin();
      }

      self.get('webglrenderer').render(self.get('scene'), self.get('camera'));

      if(config.environment === "development" || config.environment === "akr") {
        self.get('stats').end();
      }

    }

    render();

    ////////////////////

    // load font for labels and synchronously proceed with populating the scene
    new THREE.FontLoader()
      .load('three.js/fonts/roboto_mono_bold_typeface.json', function(font) {

      self.set('font', font);
      self.set('initDone', true);
      self.populateScene();
      // import new view
      self.importView();


    });

  },


  initListener() {

    const self = this;

    this.$(window).on('resize.visualization', function(){
      const outerDiv = this.$('.viz')[0];

      if(outerDiv) {

        const height = Math.round(this.$('.viz').height());
        const width = Math.round(this.$('.viz').width());

        self.set('camera.aspect', width / height);
        self.get('camera').updateProjectionMatrix();

        self.get('webglrenderer').setSize(width, height);

        self.onResized();
      }
    });


    this.get('viewImporter').on('transmitView', function(newState) {
        self.set('newState', newState);
    });


    this.get('renderingService').on('reSetupScene', function() {
      self.onReSetupScene();
    });


    this.get('urlBuilder').on('requestURL', function() {
      const state = {};

      // get timestamp
      state.timestamp = self.get('landscapeRepo.latestLandscape')
        .get('timestamp');

      // get latestApp, may be null
      const latestMaybeApp = self.get('landscapeRepo.latestApplication');
      state.appID = latestMaybeApp ? latestMaybeApp.get('id') : null;

      state.camX = self.get('camera').position.x;
      state.camY = self.get('camera').position.y;
      state.camZ = self.get('camera').position.z;

      if(state.appID){
        self.set('appCondition',[]);
        self.computeAppCondition(
          self.get('landscapeRepo.latestApplication').get('components'),
          self.get('landscapeRepo.latestApplication').get('clazzes'));
        state.appCondition = self.get('appCondition');
      }
      else{
        state.landscapeCondition = self.computeLandscapeCondition();
      }

      // Passes the state from component via service to controller
      self.get('urlBuilder').transmitState(state);
    });

    this.get('landscapeRepo').on("updated", function() {
      self.onUpdated();
    });

  },

  /*
   *  This method is used to collect data about the landscape.
   *  Ids of closed systems and nodegroups are stored in an array
   */
  computeLandscapeCondition(){

    const systems = this.get('landscapeRepo.latestLandscape').get('systems');
    const condition = [];

    systems.forEach(function(system) {

      let isRequestObject = false;

      // Find requests
      if (!isRequestObject && system.get('name') === "Requests") {
        isRequestObject = true;
      }
      // Exclude requests
      if(!isRequestObject){
        // Handle closed systems and add id to array
        if(!system.get('opened')){
          condition.push(system.get('id'));
        }
        // Handle opened systems
        else{
          // Handle closed nodegroups and add id to array
          const nodegroups = system.get('nodegroups');
          nodegroups.forEach(function(nodegroup){
            if(!nodegroup.get('opened')){
              condition.push(nodegroup.get('id'));
            }
          });
        }
      }
    });
    return condition;
  },

  /*
   *  This method is used to collect data about the application.
   *  Names of opened packages are stored in an array.
   *  Furthermore the name+highlighted of the
   *  highlighted package is stored
   */
  computeAppCondition(components, clazzes){
    const self = this;

    if(clazzes){
      clazzes.forEach(function(clazz) {
        if(clazz.get('highlighted')){
          self.get('appCondition').push(clazz.get('name').concat("highlighted"));
        }
      });
    }

    components.forEach(function(component) {
      // Handle opened packages and add name to array
      if(component.get('opened')){
        self.get('appCondition').push(component.get('name'));
        self.computeAppCondition(component.get('children'), component.get('clazzes'));
      }
      // Handle closed and highlighted packages
      else if(component.get('highlighted')){
        self.get('appCondition').push(component.get('name').concat("highlighted"));
      }
    });
  },


  /*
   *  This method is used to open and close specified systems
   *  and nodegroups. The array 'condition' contains the ids of
   *  of all closed systems and nodegroups
   */
  applyLandscapeCondition(landscape){

    const self = this;

    const systems = landscape.get('systems');

    systems.forEach(function(system) {
      let isRequestObject = false;

      if (!isRequestObject && system.get('name') === "Requests") {
        isRequestObject = true;
      }

      if(!isRequestObject){

        // Open system
        system.setOpened(true);
        for (var i = 0; i < self.get('condition').length; i++) {

          // Close system if id is in condition
          if(parseFloat(system.get('id')) === parseFloat(self.get('condition')[i])){
            system.setOpened(false);
          }
        }

        // Check condition of nodegroups if system is opened
        if(system.get('opened')){
          const nodegroups = system.get('nodegroups');

          nodegroups.forEach(function(nodegroup) {

            // Open nodegroup
            nodegroup.setOpened(true);
            for (var i = 0; i < self.get('condition').length; i++) {

              // Close nodegroup if id is in condition
              if(parseFloat(nodegroup.get('id')) === parseFloat(self.get('condition')[i])){
                nodegroup.setOpened(false);
              }
            }
          });
        }
      }
    });
  },

  applyAppCondition(application){

    const self = this;

    if(application){
      let components = null;
      if(self.get('initImport')){
        components = application.get('components');
        self.set('initImport', false);
      }
      else{
        components = application.get('children');
      }

      const clazzes = application.get('clazzes');

      if(clazzes){
        clazzes.forEach(function(clazz) {
          // Look for highlighted clazzes
          for (var i = 0; i < self.get('condition').length; i++) {
            if(clazz.get('name').concat("highlighted") === self.get('condition')[i]) {
              clazz.set('highlighted',true);
            }
          }
        });
      }

      if(components){
        components.forEach(function(component) {
          // Close component
          component.setOpenedStatus(false);
          for (var i = 0; i < self.get('condition').length; i++) {
            // Open component if name is in condition
            if(component.get('name') === self.get('condition')[i]){
              component.setOpenedStatus(true);
              self.applyAppCondition(component);
            }
            // case not opened => maybe highlighted
            else if(component.get('name').concat("highlighted") === self.get('condition')[i]) {
              component.set('highlighted',true);
            }
          }
        });
      self.cleanAndUpdateScene();
      }
    }
  },

  /**
    This method is used to update the camera with query parameters
  */
  importView(){

    const self = this;

    this.get('viewImporter').requestView();

    const camX = this.get('newState').camX;
    const camY = this.get('newState').camY;
    const camZ = this.get('newState').camZ;

    this.set('condition', this.get('newState').condition);

    if(!isNaN(camX)){
      this.get('camera').position.x = camX;
    }
    if(!isNaN(camY)){
      this.get('camera').position.y = camY;
    }
    if(!isNaN(camZ)){
      this.get('camera').position.z = camZ;
    }
    this.get('camera').updateProjectionMatrix();

    // load actual landscape
    const timestamp = this.get('newState').timestamp;
    const appID = this.get('newState').appID;

    if(timestamp) {
      self.get('reloadHandler').loadLandscapeById(timestamp, appID);
      waitForLandscape();
    }

    self.set('initImport',true);

    function waitForLandscape() {
      // New Promise
      var promise = new Ember.RSVP.Promise(
        function(resolve) {
          window.setTimeout(
            function() {
              // Wait until landscape is loaded
              if(self.get('landscapeRepo.latestLandscape') === null){
                waitForLandscape();
              }
              // Fulfill promise
              else if(self.get('landscapeRepo.latestLandscape')){
                resolve();
              }
            }, 500);
        });
      // Promise fulfilled => apply condition
      promise.then(
        function() {
          self.get('reloadHandler').stopExchange();
          if(appID){
            self.applyAppCondition(self.get('landscapeRepo.latestApplication'));
          }
          else{
            self.applyLandscapeCondition(self.get('landscapeRepo.latestLandscape'));
          }
        });
    }
  },

  /**
   * This function is called once on initRendering and everytime at the end of
   * "cleanAndUpdateScene". Inherit this function to insert objects in the
   * Three.js scene. Have a look at
   * {{#crossLink "Landscape-Rendering/cleanAndUpdateScene:method"}}
   * {{/crossLink}}
   * or
   * {{#crossLink "Application-Rendering/cleanAndUpdateScene:method"}}
   * {{/crossLink}}
   * for examplary usage.
   *
   * @method populateScene
   */
  populateScene() {},


  /**
   * This function is called when the willDestroyElement event is fired. Inherit this
   * function to cleanup custom properties or unbind listener
   * as shown in {{#crossLink "Landscape-Rendering"}}{{/crossLink}}.
   *
   * @method cleanup
   */
  cleanup() {
    cancelAnimationFrame(this.get('animationFrameId'));

    this.set('scene', null);
    this.set('webglrenderer', null);

    // clean up WebGL rendering context by forcing context loss
    var gl = this.get('canvas').getContext('webgl');
    gl.getExtension('WEBGL_lose_context').loseContext();

    this.set('camera', null);
    this.get('urlBuilder').off('requestURL');

    this.removePerformanceMeasurement();

    this.$(window).off('resize.visualization');
    this.get('viewImporter').off('transmitView');
    this.get('renderingService').off('reSetupScene');
    this.get('landscapeRepo').off('updated');
  },



  /**
   * Inherit this function to update the scene with a new renderingModel. It
   * automatically removes every mesh from the scene and finally calls
   * the (overridden) "populateScene" function. Add your custom code
   * as shown in landscape-rendering.
   *
   * @method cleanAndUpdateScene
   */
  cleanAndUpdateScene() {
    const scene = this.get('scene');

    removeAllChildren(scene);

    function removeAllChildren(entity) {
      for (let i = entity.children.length - 1; i >= 0 ; i--) {
        let child = entity.children[i];

        removeAllChildren(child);

        if (child.type !== 'AmbientLight' && child.type !== 'SpotLight' && child.type !== 'DirectionalLight') {
          if(child.type !== 'Object3D') {
            child.geometry.dispose();
            child.material.dispose();
          }
          entity.remove(child);
        }
      }
    }
    this.populateScene();
  },


  /**
   * This function is called automatically when a new landscape was fetched. It
   * is executed before
   * {{#crossLink "Rendering-Core/cleanAndUpdateScene:method"}}{{/crossLink}}.
   * Inherit this function to preprocess the
   * {{#crossLink "Landscape"}}{{/crossLink}} for rendering, e.g. filter some
   * value.
   *
   * See {{#crossLink "Application-Rendering"}}{{/crossLink}} for example usage.
   *
   * @method preProcessEntity
   */
  preProcessEntity() {},





  // Listener-Callbacks. Override in extending components

  onReSetupScene() {
    this.cleanAndUpdateScene();
  },

  onUpdated() {
    this.cleanAndUpdateScene();
  },

  onResized() {
    this.cleanAndUpdateScene();
  }

});
