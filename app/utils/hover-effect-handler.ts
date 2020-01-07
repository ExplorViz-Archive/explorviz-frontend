import { calculateColorBrightness } from
  'explorviz-frontend/utils/helpers/threejs-helpers';
import THREE from "three";

type EntityColorObject = {
  entity: THREE.Mesh,
  color: THREE.Color
}

export default class HoverEffectHandler {

  hoveredEntityColorObj:null|EntityColorObject = null;

  resetHoverEffect() : void {
    let hoveredEntityColorObj = this.hoveredEntityColorObj;
    if (hoveredEntityColorObj) {
      // Restore old color and reset cached object
      const material = hoveredEntityColorObj.entity.material as THREE.MeshBasicMaterial|THREE.MeshLambertMaterial;
      material.color = hoveredEntityColorObj.color;
      this.hoveredEntityColorObj = null;
    }
  }


  handleHoverEffect(mesh: THREE.Mesh|undefined): void {
    // No raycastTarget, do nothing and return
    if (mesh === undefined) {
      this.resetHoverEffect();
      return;
    }

    // Same object, do nothing and return
    let hoveredEntityColorObj = this.hoveredEntityColorObj;
    if (hoveredEntityColorObj && hoveredEntityColorObj.entity === mesh) {
      return;
    }

    this.resetHoverEffect();

    const material = mesh.material as THREE.MeshBasicMaterial|THREE.MeshLambertMaterial;
    const oldColor = material.color;

    this.hoveredEntityColorObj = {
      entity: mesh,
      color: new THREE.Color().copy(oldColor)
    };

    material.color = calculateColorBrightness(oldColor, 1.1);
  }

}