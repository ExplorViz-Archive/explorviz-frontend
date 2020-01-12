import THREE from "three";

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

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
      });
      const geo = new THREE.PlaneGeometry(width, height);
  
      const plane = new THREE.Mesh(geo, material);
      plane.position.copy(position);
      object.add(plane);
      plane.userData['type'] = type;
    }
  }
}
