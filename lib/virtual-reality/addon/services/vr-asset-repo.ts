import Service from '@ember/service';
import THREE from "three";
import { CloseIconTextures } from "../utils/view-objects/vr/close-icon";

export default class VrAssetRepository extends Service {
  closeIconTextures!: CloseIconTextures;
  font: THREE.Font | undefined;

  init() {
    super.init();

    // Load texture for the close button.
    const textureLoader = new THREE.TextureLoader();
    this.closeIconTextures = {
      defaultTexture: textureLoader.load('images/x_white_transp.png'),
      hoverTexture: textureLoader.load('images/x_white.png')
    };
  }
}

declare module '@ember/service' {
  interface Registry {
    'vr-asset-repo': VrAssetRepository;
  }
}
