import THREE from "three";
import LogoMesh from "explorviz-frontend/view-objects/3d/logo-mesh";

type LogoTextures = {
  [textureName: string]: THREE.Texture
}
export default class ThreeImageLoader {

  logos: LogoTextures = {};

  textureLoader: THREE.TextureLoader = new THREE.TextureLoader();

  createPicture(position: THREE.Vector3, width: number, height: number, textureName: string, parent: THREE.Object3D, type: string): void {
    if (this.logos[textureName]) {
      addTextureToObject(position, this.logos[textureName], width, height, parent, type);
    }
    else {
      this.textureLoader.load('/images/logos/' + textureName + '.png', (texture) => {
        this.logos[textureName] = texture;

        addTextureToObject(position, this.logos[textureName], width, height, parent, type);

      });
    }

    function addTextureToObject(position: THREE.Vector3, texture: THREE.Texture, width: number, height: number,
      object: THREE.Object3D, type: string) {

      const logoMesh = new LogoMesh(texture, width, height, type);
      logoMesh.position.copy(position);

      object.add(logoMesh);
    }
  }
}
