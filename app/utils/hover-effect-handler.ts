import Object from '@ember/object';
import { inject as service } from "@ember/service";
import { calculateColorBrightness } from
  'explorviz-frontend/utils/helpers/threejs-helpers';
import THREE from "three";
import CurrentUser from 'explorviz-frontend/services/current-user';

export default Object.extend({

  hoveredEntityColorObj: null,
  currentUser: service(),

  resetHoverEffect() : void {
    let hoveredEntityColorObj: any = this.get('hoveredEntityColorObj');
    if (hoveredEntityColorObj) {
      // Restore old color and reset cached object
      hoveredEntityColorObj.entity.material.color = hoveredEntityColorObj.color;
      this.set('hoveredEntityColorObj', null);
    }
  },


  handleHoverEffect(raycastTarget: {
    distance: number, point: THREE.Vector3,
    face: THREE.Face3, faceIndex: number, object: THREE.Mesh, uv: THREE.Vector2
  }): void {
    let currentUser: CurrentUser = this.get('currentUser') as CurrentUser;
    let enableHoverEffects = currentUser.getPreferenceOrDefaultValue('flagsetting', 'enableHoverEffects');

    // No raycastTarget, do nothing and return
    if (!raycastTarget || !enableHoverEffects) {
      this.resetHoverEffect();
      return;
    }

    const newHoverEntity = raycastTarget.object;

    // Same object, do nothing and return
    let hoveredEntityColorObj: any = this.get('hoveredEntityColorObj');
    if (hoveredEntityColorObj && hoveredEntityColorObj.entity === newHoverEntity) {
      return;
    }

    this.resetHoverEffect();

    const material = newHoverEntity.material as THREE.MeshBasicMaterial;
    const oldColor = material.color;

    this.set('hoveredEntityColorObj', {
      entity: newHoverEntity,
      color: new THREE.Color().copy(oldColor)
    });

    material.color = calculateColorBrightness(oldColor, 1.1);
  },

});