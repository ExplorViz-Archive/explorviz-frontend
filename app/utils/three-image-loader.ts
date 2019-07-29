import Object from '@ember/object';
import THREE from "three";

export default Object.extend({

  logos: null,

  init() {
    this._super(...arguments);
    this.set('logos', {});
  },

  createPicture(x: number, y: number, z: number, width: number, height: number, textureName: string, parent: THREE.Object3D, type: string): THREE.Mesh | null {
    let logos = this.get('logos');
    if (!logos) {
      return null;
    }

    if (logos[textureName]) {
      const material = new THREE.MeshBasicMaterial({
        map: logos[textureName],
        transparent: true
      });

      const geo = new THREE.PlaneGeometry(width, height);

      const plane = new THREE.Mesh(geo, material);
      plane.position.set(x, y, z);
      parent.add(plane);
      plane.userData['type'] = type;
      return plane;
    }
    else {
      new THREE.TextureLoader().load('/images/logos/' + textureName + '.png', (texture) => {
        let logos: any = this.get('logos');
        if (!logos) {
          return null;
        }

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true
        });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height),
          material);

        plane.position.set(x, y, z);
        parent.add(plane);
        plane.userData['type'] = type;

        logos[textureName] = texture;

        return plane;
      });
    }
    return null;
  }

});
