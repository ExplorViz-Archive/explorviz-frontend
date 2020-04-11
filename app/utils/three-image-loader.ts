import THREE from 'three';
import LogoMesh from 'explorviz-frontend/view-objects/3d/logo-mesh';

export default class ThreeImageLoader {
  logos: Map<string, THREE.Texture> = new Map();

  textureLoader: THREE.TextureLoader = new THREE.TextureLoader();

  createPicture(position: THREE.Vector3, width: number, height: number,
    textureName: string, parent: THREE.Object3D, type: string): void {
    const logo = this.logos.get(textureName);

    function addTextureToObject(texture: THREE.Texture, object: THREE.Object3D) {
      const logoMesh = new LogoMesh(texture, width, height, type);
      logoMesh.position.copy(position);

      object.add(logoMesh);
    }

    if (logo) {
      addTextureToObject(logo, parent);
    } else {
      this.textureLoader.load(`/images/logos/${textureName}.png`, (texture) => {
        this.logos.set(textureName, texture);

        addTextureToObject(this.logos.get(textureName) as THREE.Texture, parent);
      });
    }
  }
}
