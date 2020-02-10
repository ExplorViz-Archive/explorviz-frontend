import Service from '@ember/service';
import Evented from '@ember/object/evented';
import Clazz from 'explorviz-frontend/models/clazz';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';
import ClazzCommunication from 'explorviz-frontend/models/clazzcommunication';
import THREE from 'three';
import Landscape from 'explorviz-frontend/models/landscape';
import Application from 'explorviz-frontend/models/application';

export interface RenderingContext {
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer
}

export default class RenderingService extends Service.extend(Evented) {
  renderingContexts: Map<string, RenderingContext> = new Map();

  customRenderingPipelines: Map<string, Function[]> = new Map();

  reSetupScene() {
    // Redraws and repositions scene to default
    this.trigger('reSetupScene');
  }

  redrawScene() {
    // Only redraws
    this.trigger('redrawScene');
  }

  /**
   * Triggers camera to move to a specified ember model
   * @param {*} emberModel Model which the camera should focus on
   */
  moveCameraTo(emberModel: Clazz | DrawableClazzCommunication | ClazzCommunication) {
    this.trigger('moveCameraTo', emberModel);
  }

  addRendering(id: string, context: RenderingContext, pipeline: Function[]): boolean {
    if (this.renderingContexts.get(id) !== undefined
      || this.customRenderingPipelines.get(id) !== undefined) {
      // there already exists a rendering with passed id
      return false;
    }
    this.renderingContexts.set(id, context);
    this.customRenderingPipelines.set(id, pipeline);
    return true;
  }

  removeRendering(id: string) {
    this.renderingContexts.delete(id);
    this.customRenderingPipelines.delete(id);
  }

  overwritePipeline(id: string, pipeline: Function[]): boolean {
    const oldPipeline = this.getPipelineById(id);
    if (oldPipeline === undefined || pipeline.length <= 0) { return false; }

    this.customRenderingPipelines.set(id, pipeline);

    return true;
  }

  getSceneById(id: string) {
    const renderingContext = this.renderingContexts.get(id);
    if (renderingContext === undefined) { return undefined; }

    return renderingContext.scene;
  }

  getCameraById(id: string) {
    const renderingContext = this.renderingContexts.get(id);
    if (renderingContext === undefined) { return undefined; }

    return renderingContext.camera;
  }

  getRendererById(id: string) {
    const renderingContext = this.renderingContexts.get(id);
    if (renderingContext === undefined) { return undefined; }

    return renderingContext.renderer;
  }

  getCanvasById(id: string) {
    const renderingContext = this.renderingContexts.get(id);
    if (renderingContext === undefined) { return undefined; }

    return renderingContext.renderer.domElement;
  }

  getPipelineById(id: string) {
    return this.customRenderingPipelines.get(id);
  }

  render(id: string, input: Landscape|Application) {
    const pipeline = this.getPipelineById(id);
    if (pipeline === undefined || pipeline.length <= 0) { return; }

    let lastOutput: any = input;
    for (let i = 0; i < pipeline.length; i++) {
      lastOutput = pipeline[i](lastOutput);
    }
  }
}

declare module '@ember/service' {
  interface Registry {
    'rendering-service': RenderingService;
  }
}
