import Service from '@ember/service';
import THREE from 'three';

export default class ReposAssetRepo extends Service {
  earthTexture: THREE.Texture;

  constructor() {
    super();

    this.earthTexture = new THREE.TextureLoader().load('images/earth-map.jpg');
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'repos/asset-repo': ReposAssetRepo;
  }
}
