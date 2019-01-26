import Object from '@ember/object';
import { inject as service } from "@ember/service";
import { calculateColorBrightness } from 
  'explorviz-frontend/utils/helpers/threejs-helpers';
import THREE from "three";

export default Object.extend({

  hoveredEntityColorObj: null,
  session: service(),

  resetHoverEffect() {
    if (this.get('hoveredEntityColorObj')) {

      this.get('hoveredEntityColorObj').entity.material.color =
        this.get('hoveredEntityColorObj').color;

      this.set('hoveredEntityColorObj', null);
    }
  },


  handleHoverEffect(raycastTarget) {

    const user = this.get('session.session.content.authenticated.user');
    // no raycastTarget, do nothing and return
    if (!raycastTarget ||
      !user.settings.booleanAttributes.enableHoverEffects) {
      this.resetHoverEffect();
      return;
    }

    const newHoverEntity = raycastTarget.object;

    // same object, do nothing and return
    if (this.get('hoveredEntityColorObj') &&
      this.get('hoveredEntityColorObj').entity === newHoverEntity) {
      return;
    }

    this.resetHoverEffect();

    const oldColor = newHoverEntity.material.color;

    this.set('hoveredEntityColorObj', {
      entity: newHoverEntity,
      color: new THREE.Color().copy(oldColor)
    });

    newHoverEntity.material.color = calculateColorBrightness(oldColor, 1.1);

  },

});