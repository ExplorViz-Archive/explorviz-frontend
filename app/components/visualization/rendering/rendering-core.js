import Component from '@ember/component';
import {inject as service} from '@ember/service';
import Evented from '@ember/object/evented';
import THREE from "three";
import THREEPerformance from 'explorviz-frontend/mixins/threejs-performance';
import debugLogger from 'ember-debug-logger';
import $ from 'jquery';

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

  // No Ember generated container
  tagName: '',

  debug: debugLogger(),

  state: null,

  reloadHandler: service("reload-handler"),
  landscapeRepo: service("repos/landscape-repository"),
  highlighter: service("visualization/application/highlighter"),
  addionalData: service("additional-data"),
  renderingService: service(),

  session: service(),

  scene : null,
  webglrenderer: null,
  camera: null,

  canvas: null,

  font: null,
  animationFrameId: null,

  initDone: false,

  appCondition: null,
  initImport: true,

  init()  {
    this._super(...arguments);
    this.set('appCondition', []);
  },


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
   * @method initRenderings
   */
  initRendering() {

    this.debug('init rendering-core');

    const self = this;

    // Get size if outer ember div
    const height = $('#rendering').innerHeight();
    const width = $('#rendering').innerWidth();

    const canvas = $('#threeCanvas')[0];

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

    const { user } = this.get('session.data.authenticated');
    const userSettings = user.get('settings');

    if(!userSettings.booleanAttributes.showFpsCounter) {
      this.removePerformanceMeasurement();
    }

    // Rendering loop //
    function render() {
      
      if(self.get('isDestroyed')) {
        return;
      }
      
      const animationId = requestAnimationFrame(render);
      self.set('animationFrameId', animationId);

      if(userSettings.booleanAttributes.showFpsCounter) {
        self.get('threexStats').update(self.get('webglrenderer'));
        self.get('stats').begin();
      }

      self.get('webglrenderer').render(self.get('scene'), self.get('camera'));

      if(userSettings.booleanAttributes.showFpsCounter) {
        self.get('stats').end();
      }

    }

    render();

    ////////////////////

    // Load font for labels and synchronously proceed with populating the scene
    new THREE.FontLoader()
      .load('three.js/fonts/roboto_mono_bold_typeface.json', function(font) {
        if(self.isDestroyed)
          return;
          
        self.set('font', font);
        self.set('initDone', true);
        self.populateScene();
    });

  },


  updateCanvasSize() {
    const outerDiv = $('#vizspace')[0];

    if(outerDiv) {
      if(!this.get('camera') || !this.get('webglrenderer'))
        return;

      $('#threeCanvas').hide();

      const height = Math.round($('#rendering').innerHeight());
      const width = Math.round($('#rendering').innerWidth());

      this.set('camera.aspect', width / height);
      this.get('camera').updateProjectionMatrix();

      this.get('webglrenderer').setSize(width, height);

      this.onResized();

      $('#threeCanvas').show();
    }
  },


  initListener() {

    const self = this;

    $(window).on('resize.visualization', this.updateCanvasSize.bind(this));



    this.get('renderingService').on('reSetupScene', function() {
      self.onReSetupScene();
    });

    this.get('renderingService').on('resizeCanvas', function() {
      self.updateCanvasSize();
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
    if(clazzes){
      clazzes.forEach( (clazz) => {
        if(clazz.get('highlighted')){
          this.get('appCondition').push(clazz.get('name').concat("highlighted"));
        }
      });
    }

    components.forEach( (component) =>{
      // Handle opened packages and add name to array
      if(component.get('opened')){
        this.get('appCondition').push(component.get('name'));
        this.computeAppCondition(component.get('children'), component.get('clazzes'));
      }
      // Handle closed and highlighted packages
      else if(component.get('highlighted')){
        this.get('appCondition').push(component.get('name').concat("highlighted"));
      }
    });
  },


  /*
   *  This method is used to open and close specified systems
   *  and nodegroups. The array 'condition' contains the ids of
   *  of all closed systems and nodegroups
   */
  applyLandscapeCondition(landscape){

    const systems = landscape.get('systems');

    systems.forEach( (system) => {
      let isRequestObject = false;

      if (!isRequestObject && system.get('name') === "Requests") {
        isRequestObject = true;
      }

      if(!isRequestObject){

        // Open system
        system.setOpened(true);
        for (var i = 0; i < this.get('condition').length; i++) {

          // Close system if id is in condition
          if(parseFloat(system.get('id')) === parseFloat(this.get('condition')[i])){
            system.setOpened(false);
          }
        }

        // Check condition of nodegroups if system is opened
        if(system.get('opened')){
          const nodegroups = system.get('nodegroups');

          nodegroups.forEach(function(nodegroup) {

            // Open nodegroup
            nodegroup.setOpened(true);
            for (var i = 0; i < this.get('condition').length; i++) {

              // Close nodegroup if id is in condition
              if(parseFloat(nodegroup.get('id')) === parseFloat(this.get('condition')[i])){
                nodegroup.setOpened(false);
              }
            }
          });
        }
      }
    });
  },

  applyAppCondition(application){

    if (!application) {
      return;
    } 

    // Get clazzes of application
    let components = null;
    if(this.get('initImport')){
      components = application.get('components');
      this.set('initImport', false);
    }
    else{
      components = application.get('children');
    }

    const clazzes = application.get('clazzes');

    // Set states of clazzes
    if(clazzes){
      clazzes.forEach(function(clazz) {
        // Look for highlighted clazzes
        for (var i = 0; i < this.get('condition').length; i++) {
          if(clazz.get('name').concat("highlighted") === this.get('condition')[i]) {
            clazz.set('highlighted',true);
          }
        }
      });
    }

    // Set states if components
    if(components){
      components.forEach(function(component) {
        // Close component
        component.setOpenedStatus(false);
        for (var i = 0; i < this.get('condition').length; i++) {
          // Open component if name is in condition
          if(component.get('name') === this.get('condition')[i]){
            component.setOpenedStatus(true);
            this.applyAppCondition(component);
          }
          // Case not opened => maybe highlighted
          else if(component.get('name').concat("highlighted") === this.get('condition')[i]) {
            component.set('highlighted',true);
          }
        }
      });
      this.cleanAndUpdateScene();
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

    // Clean up WebGL rendering context by forcing context loss
    var gl = this.get('canvas').getContext('webgl');
    gl.getExtension('WEBGL_lose_context').loseContext();

    this.set('camera', null);

    this.removePerformanceMeasurement();

    $(window).off('resize.visualization');
    this.get('renderingService').off('reSetupScene');
    this.get('landscapeRepo').off('updated');

    this.get('highlighter').unhighlightAll();
    this.get('addionalData').emptyAndClose();
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
