import Ember from 'ember';
import THREE from "npm:three";
import config from '../config/environment';
import THREEPerformance from '../mixins/threejs-performance';

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
* @class Rendering-Core
* @extends Ember.Component
*/
export default Ember.Component.extend(Ember.Evented, THREEPerformance, {

  state: null,

  // Declare url-builder service 
  urlBuilder: Ember.inject.service("url-builder"),

  // Declare view-importer service 
  viewImporter: Ember.inject.service("view-importer"),

  reloadHandler: Ember.inject.service("reload-handler"),
  landscapeRepo: Ember.inject.service("repos/landscape-repository"),
  renderingService: Ember.inject.service(),

  classNames: ['viz'],

  scene : null,
  webglrenderer: null,
  camera: null,

  canvas: null,

  font: null,
  animationFrameId: null,

  initDone: false,


  // @Override
  didRender(){
    this._super(...arguments);
    this.initRendering();
    this.initListener();
  },


  // @Override
  willDestroyElement() {
    this._super(...arguments);
    this.cleanup();    
  },

  /**
   * This function is called once on the didRender event. Inherit this function 
   * to call other important function, e.g. initInteraction as shown in 
   * {@landscape-rendering}.
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

      // Passes the state from component via service to controller
      self.get('urlBuilder').transmitState(state);
    });


    this.get('landscapeRepo').on("updated", function() {
      self.onUpdated();
    });


  },


  /**
    This method is used to update the camera with query parameters
  */ 
  importView(){
    
    this.get('viewImporter').requestView();

    const camX = this.get('newState').camX;
    const camY = this.get('newState').camY;
    const camZ = this.get('newState').camZ;

    if(!isNaN(camX)){
      this.get('camera').position.x = camX;
    }
    if(!isNaN(camY)){
      this.get('camera').position.y = camY;
    }
    if(!isNaN(camZ)){
      console.log(camZ);
      this.get('camera').position.z = camZ;
    }
    this.get('camera').updateProjectionMatrix();


    // load actual landscape
    
    const timestamp = this.get('newState').timestamp;
    const appID = this.get('newState').appID;

    if(timestamp) {
      this.get('reloadHandler').stopExchange();
      this.get('landscapeRepo').loadLandscapeById(timestamp, appID);
    }
  },



  /**
   * This function is called once on initRendering. Inherit this function to 
   * insert objects in the Three.js scene. Have a look 
   * at {{#crossLink "Landscape-Rendering"}}{{/crossLink}} for an example.
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
    this.set('camera', null);
    this.get('urlBuilder').off('requestURL');

    this.removePerformanceMeasurement();

    this.$(window).off('resize.visualization');
    this.get('viewImporter').off('transmitView');
    this.get('renderingService').off('onReSetupScene');
    this.get('landscapeRepo').off('updated');
  },



  /**
   * Inherit this function to update the scene with a new renderingModel. It 
   * automatically removes every mesh from the scene. Add your custom code 
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

  onReSetupScene() {},

  onUpdated() {},

  onResized() {}

});
