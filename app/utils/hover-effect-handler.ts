import calculateColorBrightness from
  'explorviz-frontend/utils/helpers/threejs-helpers';
import THREE from 'three';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';

export default class HoverEffectHandler {
  hoveredEntityObj: null|BaseMesh = null;

  /**
   * Alters the color of a given mesh such that it is clear which mesh
   * the mouse points at
   *
   * @param mesh Mesh which shall receive a hover effect
   */
  applyHoverEffect(mesh: BaseMesh): void {
    // Same object, do nothing and return
    if (this.hoveredEntityObj === mesh) {
      return;
    }

    // Reset old hover effect
    this.resetHoverEffect();

    const material = mesh.material as THREE.MeshBasicMaterial|THREE.MeshLambertMaterial;
    const oldColor = material.color;

    this.hoveredEntityObj = mesh;

    material.color = calculateColorBrightness(oldColor, 1.1);
  }

  /**
   * Restores original color of mesh which had a hover effect
   */
  resetHoverEffect(): void {
    const { hoveredEntityObj } = this;
    if (hoveredEntityObj) {
      // Restore old color and reset cached object
      const material = hoveredEntityObj.material as THREE.MeshBasicMaterial
      |THREE.MeshLambertMaterial;
      const { highlighted, defaultColor, highlightingColor } = hoveredEntityObj;

      material.color = highlighted ? highlightingColor : defaultColor;
      this.hoveredEntityObj = null;
    }
  }
}
