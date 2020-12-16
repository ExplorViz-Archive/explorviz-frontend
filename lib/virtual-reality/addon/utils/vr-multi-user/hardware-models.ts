import THREE from 'three';
import { OBJLoader } from '../lib/loader/OBJLoader';

export default class HardwareModels extends Object {
  hmd: THREE.Group|undefined;

  private leftOculusController: THREE.Group|undefined;

  private rightOculusController: THREE.Group|undefined;

  private viveController: THREE.Group|undefined;

  constructor() {
    super();
    const loader = new OBJLoader(THREE.DefaultLoadingManager);

    this.loadHMDModel(loader);
    this.loadOculusLeftControllerModel(loader);
    this.loadOculusRightControllerModel(loader);
    this.loadViveControllerModel(loader);
  }

  loadHMDModel(loader: OBJLoader) {
    loader.load('/generic_hmd/generic_hmd.obj', (object) => {
      object.name = 'hmdTexture';
      const textureLoader = new THREE.TextureLoader();
      textureLoader.setPath('/generic_hmd/');
      object.children[0].material.map = textureLoader.load('generic_hmd.tga');
      this.hmd = object;
    });
  }

  loadOculusLeftControllerModel(loader: OBJLoader) {
    loader.load('controller/oculus_controller/oculus_cv1_controller_left.obj', (object) => {
      const controller = HardwareModels.addTexture(object, 'controller/oculus_controller/', 'external_controller01_col.png', 'external_controller01_spec.png');
      HardwareModels.positionController(controller);

      this.leftOculusController = object;
    });
  }

  loadOculusRightControllerModel(loader: OBJLoader) {
    loader.load('controller/oculus_controller/oculus_cv1_controller_right.obj', (object) => {
      const controller = HardwareModels.addTexture(object, 'controller/oculus_controller/', 'external_controller01_col.png', 'external_controller01_spec.png');
      HardwareModels.positionController(controller);

      this.rightOculusController = object;
    });
  }

  loadViveControllerModel(loader: OBJLoader) {
    loader.load('controller/vive_controller/vr_controller_vive_1_5.obj', (object) => {
      const controller = HardwareModels.addTexture(object, 'controller/vive_controller/', 'onepointfive_texture.png', 'onepointfive_spec.png');
      HardwareModels.positionController(controller);

      this.viveController = object;
    });
  }

  getLeftOculusController() {
    return this.leftOculusController?.clone();
  }

  getRightOculusController() {
    return this.rightOculusController?.clone();
  }

  getViveController() {
    return this.viveController?.clone();
  }

  static addTexture(obj: THREE.Mesh, path: string, mapPath: string, specMapPath: string) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath(path);
    const controller = obj.children[0];
    // @ts-ignore
    const { material } = controller;
    material.map = textureLoader.load(mapPath);
    material.specularMap = textureLoader.load(specMapPath);

    return controller;
  }

  static positionController(controller: THREE.Object3D) {
    controller.rotateX(0.71);
    controller.position.x -= 0.0071;
    controller.position.y += 0.035;
    controller.position.z -= 0.035;
  }
}
