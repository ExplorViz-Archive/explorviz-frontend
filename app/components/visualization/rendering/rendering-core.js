import Component from '@ember/component';
import { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import THREE from "three";
import THREEPerformance from 'explorviz-frontend/utils/threejs-performance';
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
export default Component.extend(Evented, {

  // No Ember generated container
  tagName: '',

  debug: debugLogger(),

  state: null,

  highlighter: service("visualization/application/highlighter"),
  landscapeRepo: service("repos/landscape-repository"),
  additionalData: service(),
  configuration: service(),
  reloadHandler: service(),
  renderingService: service(),

  currentUser: service(),

  scene: null,
  webglrenderer: null,
  camera: null,

  canvas: null,

  font: null,
  animationFrameId: null,

  initDone: false,

  appCondition: null,
  initImport: true,

  listeners: null,

  threePerformance: null,

  init() {
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
  didRender() {
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
    const backgroundColor = this.get('configuration.landscapeColors.background');
    this.set('scene.background', new THREE.Color(backgroundColor));

    this.set('camera', new THREE.PerspectiveCamera(75, width / height, 0.1, 1000));

    this.set('webglrenderer', new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas
    }));
    this.get('webglrenderer').setPixelRatio(window.devicePixelRatio);
    this.get('webglrenderer').setSize(width, height);

    let showFpsCounter = this.get('currentUser').getPreferenceOrDefaultValue('flagsetting', 'showFpsCounter');

    if (showFpsCounter) {
      this.threePerformance = new THREEPerformance();
    }

    // Rendering loop //
    function render() {
      if (self.get('isDestroyed')) {
        return;
      }

      const animationId = requestAnimationFrame(render);
      self.set('animationFrameId', animationId);

      if (showFpsCounter) {
        self.threePerformance.threexStats.update(self.get('webglrenderer'));
        self.threePerformance.stats.begin();
      }

      self.get('webglrenderer').render(self.get('scene'), self.get('camera'));

      if (showFpsCounter) {
        self.threePerformance.stats.end();
      }
    }

    render();

    ////////////////////

    // Load font for labels and synchronously proceed with populating the scene
    new THREE.FontLoader().load(
      // resource URL
      '/three.js/fonts/roboto_mono_bold_typeface.json',

      // onLoad callback
      function ( font ) {

        if (self.isDestroyed)
          return;

        self.set('font', font);
        self.debug("(THREE.js) font sucessfully loaded.");
        self.set('initDone', true);
        self.populateScene();
      },

      // onProgress callback
      // function ( xhr ) {
      //   self.debug("(THREE.js) font " + (xhr.loaded / xhr.total * 100) + "% loaded.");
      // },

      // onError callback
      // function ( error ) {
      //   self.debug("(THREE.js) Error when loading font!");
      // }  
    );

  },


  updateCanvasSize() {
    const outerDiv = $('#vizspace')[0];

    if (outerDiv) {
      if (!this.get('camera') || !this.get('webglrenderer'))
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
    this.set('listeners', new Set());

    this.get('listeners').add([
      'renderingService',
      'reSetupScene',
      () => {
        this.onReSetupScene();
      }
    ]);

    this.get('listeners').add([
      'renderingService',
      'resizeCanvas',
      () => {
        this.updateCanvasSize();
      }
    ]);

    this.get('listeners').add([
      'renderingService',
      'moveCameraTo',
      (emberModel) => {
        this.onMoveCameraTo(emberModel);
      }
    ]);

    this.get('listeners').add([
      'landscapeRepo',
      'updated',
      () => {
        this.onUpdated();
      }
    ]);

    // Start subscriptions
    this.get('listeners').forEach(([service, event, listenerFunction]) => {
        this.get(service).on(event, listenerFunction);
    });
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
  populateScene() { },

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

    if(this.threePerformance) {
      this.threePerformance.removePerformanceMeasurement();
    }

    // Unsubscribe from all services
    this.get('listeners').forEach(([service, event, listenerFunction]) => {
      this.get(service).off(event, listenerFunction);
    });
    this.set('listeners', null);

    this.get('highlighter').unhighlightAll();
    this.get('additionalData').emptyAndClose();
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
      for (let i = entity.children.length - 1; i >= 0; i--) {
        let child = entity.children[i];

        removeAllChildren(child);

        if (child.type !== 'AmbientLight' && child.type !== 'SpotLight' && child.type !== 'DirectionalLight') {
          if (child.type !== 'Object3D') {
            child.geometry.dispose();
            child.material.dispose();
          }
          entity.remove(child);
        }
      }
    }
    this.populateScene();
  },
  

  // Listener-Callbacks. Override in extending components

  onReSetupScene() {
    this.cleanAndUpdateScene();
  },

  onUpdated() {
    this.cleanAndUpdateScene();
  },

  onResized() {
    this.cleanAndUpdateScene();
  },

  onMoveCameraTo() {},

});
