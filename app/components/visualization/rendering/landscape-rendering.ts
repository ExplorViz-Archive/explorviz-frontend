import { inject as service } from '@ember/service';
import GlimmerComponent from "@glimmer/component";
import { getOwner } from '@ember/application';
import { action } from "@ember/object";
import debugLogger from "ember-debug-logger";
import THREEPerformance from 'explorviz-frontend/utils/threejs-performance';
import $ from 'jquery';
import THREE from 'three';
import Landscape from 'explorviz-frontend/models/landscape';
import RenderingService from "explorviz-frontend/services/rendering-service";
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import AdditionalData from 'explorviz-frontend/services/additional-data';
import Configuration from 'explorviz-frontend/services/configuration';
import ReloadHandler from 'explorviz-frontend/services/reload-handler';
import CurrentUser from 'explorviz-frontend/services/current-user';

import applyKlayLayout from
  'explorviz-frontend/utils/landscape-rendering/klay-layouter';
import Interaction from
  'explorviz-frontend/utils/landscape-rendering/interaction';
import Labeler from
  'explorviz-frontend/utils/landscape-rendering/labeler';
import * as CalcCenterAndZoom from
  'explorviz-frontend/utils/landscape-rendering/center-and-zoom-calculator';
import * as EntityRendering from
  'explorviz-frontend/utils/landscape-rendering/entity-rendering'
import * as CommunicationRendering from
  'explorviz-frontend/utils/landscape-rendering/communication-rendering'
import ImageLoader from 'explorviz-frontend/utils/three-image-loader';
import Application from 'explorviz-frontend/models/application';
import { tracked } from '@glimmer/tracking';


interface Args {
  id: string,
  landscape: Landscape
}

/**
* Renderer for landscape visualization.
*
* @class Landscape-Rendering-Component
* @extends Rendering-Core-Component
*
* @module explorviz
* @submodule visualization.rendering
*/
export default class LandscapeRendering extends GlimmerComponent<Args> {

  @service('repos/landscape-repository')
  landscapeRepo!: LandscapeRepository;

  @service('additional-data')
  additionalData!: AdditionalData;

  @service('configuration')
  configuration!: Configuration;

  @service('reload-handler')
  reloadHandler!: ReloadHandler;

  @service('rendering-service')
  renderingService!: RenderingService;

  @service('current-user')
  currentUser!: CurrentUser;

  scene!: THREE.Scene;
  webglrenderer!: THREE.WebGLRenderer;
  camera!: THREE.PerspectiveCamera;

  canvas!: HTMLCanvasElement;

  debug = debugLogger('LandscapeRendering');

  font!: THREE.Font;
  animationFrameId = 0;

  initDone: Boolean;

  threePerformance!: any;

  @tracked
  interaction!: any;

  labeler!: any;
  imageLoader!: any;

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.initDone = false;
    this.debug("Constructor called");
  }


  @action
  outerDivInserted(outerDiv: HTMLElement) {
    this.debug("Outer Div inserted");
    this.canvas.height = outerDiv.clientHeight;
    this.canvas.width = outerDiv.clientWidth;
    this.canvas.style.width = "";
    this.canvas.style.height = "";
    this.initRendering();
  }


  @action
  canvasInserted(canvas: HTMLCanvasElement) {
    this.debug("Canvas inserted");

    this.canvas = canvas;

    canvas.oncontextmenu = function (e) {
      e.preventDefault();
    };
  }


  // @Override
  /**
   * This overridden Ember Component lifecycle hook enables calling
   * ExplorViz's custom cleanup code.
   *
   * @method willDestroyElement
   */
  willDestroy() {
    cancelAnimationFrame(this.animationFrameId);

    // Clean up WebGL rendering context by forcing context loss
    let gl = this.canvas.getContext('webgl');
    if (!gl) {
      return;
    }
    let glExtension = gl.getExtension('WEBGL_lose_context');
    if (!glExtension) return;
    glExtension.loseContext();

    if (this.threePerformance) {
      this.threePerformance.removePerformanceMeasurement();
    }

    this.additionalData.emptyAndClose();

    this.debug("cleanup landscape rendering");

    this.imageLoader.logos = {};

    this.interaction.removeHandlers();
  }


  /**
   * This function is called once on the didRender event. Inherit this function
   * to call other important function, e.g. "initInteraction" as shown in
   * {{#crossLink "Landscape-Rendering/initInteraction:method"}}{{/crossLink}}.
   *
   * @method initRenderings
   */
  initRendering() {
    const self = this;

    // Get size if outer ember div
    const height = $('#rendering').innerHeight();
    const width = $('#rendering').innerWidth();

    if (!height || !width) {
      return;
    }

    this.scene = new THREE.Scene();
    const backgroundColor = this.configuration.landscapeColors.background;
    this.scene.background = new THREE.Color(backgroundColor);

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    this.webglrenderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas
    });

    this.webglrenderer.setPixelRatio(window.devicePixelRatio);
    this.webglrenderer.setSize(width, height);

    let showFpsCounter = this.currentUser.getPreferenceOrDefaultValue('flagsetting', 'showFpsCounter');

    if (showFpsCounter) {
      this.threePerformance = new THREEPerformance();
    }

    this.debug("init landscape-rendering");

    if (!this.interaction) {
      // Owner necessary to inject service into util
      this.interaction = Interaction.create(getOwner(this).ownerInjection());
    }

    if (!this.imageLoader) {
      this.imageLoader = ImageLoader.create();
    }

    if (!this.labeler) {
      this.labeler = Labeler.create();
    }

    this.initInteraction();

    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(30, 10, 20);
    this.scene.add(dirLight);

    // Rendering loop //
    function render() {
      if (self.isDestroyed) {
        return;
      }

      const animationId = requestAnimationFrame(render);
      self.animationFrameId = animationId;

      if (showFpsCounter) {
        self.threePerformance.threexStats.update(self.webglrenderer);
        self.threePerformance.stats.begin();
      }

      self.webglrenderer.render(self.scene, self.camera);

      if (showFpsCounter) {
        self.threePerformance.stats.end();
      }
    }

    render();

    ////////////////////

    // Load font for labels and synchronously proceed with populating the scene
    new THREE.FontLoader().load(
      // Resource URL
      '/three.js/fonts/roboto_mono_bold_typeface.json',

      // onLoad callback
      function (font) {

        if (self.isDestroyed)
          return;

        self.font = font;
        self.debug("(THREE.js) font sucessfully loaded.");
        self.initDone = true;
        self.populateScene();
      }
    );

  }


  @action
  updateCanvasSize() {
    const outerDiv = $('#vizspace')[0];

    if (outerDiv) {
      if (!this.camera || !this.webglrenderer)
        return;

      $('#threeCanvas').hide();

      let renderingHeight = $('#rendering').innerHeight();
      let renderingWidth = $('#rendering').innerWidth();

      if (renderingHeight && renderingWidth) {
        const height = Math.round(renderingHeight);
        const width = Math.round(renderingWidth);

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.webglrenderer.setSize(width, height);

        this.onResized();

        $('#threeCanvas').show();
      }
    }
  }


  /**
   * Inherit this function to update the scene with a new renderingModel. It
   * automatically removes every mesh from the scene and finally calls
   * the (overridden) "populateScene" function. Add your custom code
   * as shown in landscape-rendering.
   *
   * @method cleanAndUpdateScene
   */
  @action
  cleanAndUpdateScene() {
    const scene = this.scene;

    removeAllChildren(scene);

    function removeAllChildren(entity: THREE.Object3D | THREE.Mesh) {
      for (let i = entity.children.length - 1; i >= 0; i--) {
        let child = entity.children[i];

        removeAllChildren(child);

        if (!(child instanceof THREE.Light)) {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            } else {
              for (let material of child.material)
                material.dispose();
            }
          }
          entity.remove(child);
        }
      }
    }
    this.populateScene();

    this.debug("clean and populate landscape-rendering");

    this.interaction.raycastObjects = this.scene.children;
  }


  // Listener-Callbacks. Override in extending components
  @action
  onReSetupScene() {
    this.camera.position.set(0, 0, 0);
    this.cleanAndUpdateScene();
  }

  @action
  onUpdated() {
    if (this.initDone) {
      this.cleanAndUpdateScene();
    }
  }

  onResized() {
    this.cleanAndUpdateScene();
  }


  // @Override
  /**
   * TODO
   *
   * @method populateScene
   */
  populateScene() {
    this.debug("populate landscape-rendering");

    const emberLandscape = this.args.landscape;

    if (!emberLandscape || !this.font) {
      return;
    }

    applyKlayLayout(emberLandscape);

    let centerPoint = CalcCenterAndZoom.
      getCenterAndZoom(emberLandscape, this.camera, this.webglrenderer);
    let systems = emberLandscape.systems;

    if (systems) {
      // Draw boxes for systems
      systems.forEach((system) => {

        let systemMesh = EntityRendering.renderSystem(system, centerPoint,
          this.configuration, this.labeler, this.font);
        this.scene.add(systemMesh);

        const nodegroups = system.nodegroups;

        // Draw boxes for nodegroups
        nodegroups.forEach((nodegroup) => {

          if (!nodegroup.get('visible')) {
            return;
          }

          let nodegroupMesh = EntityRendering.renderNodeGroup(nodegroup, centerPoint,
            this.configuration, this.labeler, this.font);
          if (nodegroupMesh) {
            this.scene.add(nodegroupMesh);
          }

          const nodes = nodegroup.get('nodes');

          // Draw boxes for nodes
          nodes.forEach((node) => {

            if (!node.get('visible')) {
              return;
            }

            let nodeMesh = EntityRendering.renderNode(node, centerPoint,
              this.configuration, this.labeler, this.font);
            this.scene.add(nodeMesh);

            const applications = node.get('applications');

            // Draw boxes for applications
            applications.forEach((application) => {

              let applicationMesh = EntityRendering.renderApplication(application, centerPoint,
                this.imageLoader, this.configuration, this.labeler, this.font);
              this.scene.add(applicationMesh);
            });

          });

        });

      });
    }

    let appCommunications = emberLandscape.get('totalApplicationCommunications');

    if (appCommunications) {
      let color = this.configuration.landscapeColors.communication;
      let tiles = CommunicationRendering.computeCommunicationTiles(appCommunications, color);

      CommunicationRendering.addCommunicationLineDrawing(tiles, this.scene, centerPoint);
    }

    this.debug("Landscape loaded");
  }


  @action
  showApplication(emberModel: Application) {
    this.landscapeRepo.set('latestApplication', emberModel);
    this.landscapeRepo.set('replayApplication', emberModel);
  }

  initInteraction() {
    const canvas = this.canvas;
    const raycastObjects = this.scene.children;
    const camera = this.camera;
    const webglrenderer = this.webglrenderer;

    // Init interaction objects
    this.interaction.setupInteraction(canvas, camera, webglrenderer,
      raycastObjects);
  }

}