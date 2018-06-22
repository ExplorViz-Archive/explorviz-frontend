import Object from '@ember/object';
import THREE from "three";

export default Object.extend({

  logos: null,

  init() {
    this._super(...arguments);

    this.set('logos', {});
  },

  createPicture(x, y, z, width, height, textureName, parent, type) {
      if(this.get('logos')[textureName]) {

        const material = new THREE.MeshBasicMaterial({
          map: this.get('logos')[textureName],
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

        const self = this;

        new THREE.TextureLoader().load('images/logos/' + textureName + '.png', (texture) => {            

          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
          });
          const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height),
            material);
          plane.position.set(x, y, z);
          parent.add(plane);
          plane.userData['type'] = type;

          self.get('logos')[textureName] = texture;

          return plane;
        });
      }        
    }
  
});
