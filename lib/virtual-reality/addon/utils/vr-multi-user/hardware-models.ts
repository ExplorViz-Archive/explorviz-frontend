import THREE from 'three';
import { OBJLoader } from '../lib/loader/OBJLoader';

export default class HardwareModels extends Object {
  hmd: THREE.Group|undefined;

  constructor() {
    super();
    const loader = new OBJLoader(THREE.DefaultLoadingManager);
    this.loadHMDModel(loader);
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
}
