import calculateColorBrightness from
  'explorviz-frontend/utils/helpers/threejs-helpers';
import THREE from 'three';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import { tracked } from '@glimmer/tracking';

export default class HoverEffectHandler {
  @tracked
  hoveredEntityObj: BaseMesh|null = null;

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

    // Reset old hover effect, only one object can be hovered upon at a time
    this.resetHoverEffect();

    const material = mesh.material as THREE.MeshBasicMaterial|THREE.MeshLambertMaterial;
    this.hoveredEntityObj = mesh;

    // Calculate and apply brighter color to material ('hover effect')
    material.color = calculateColorBrightness(material.color, 1.1);
  }

  /**
   * Restores original color of mesh which had a hover effect
   */
  resetHoverEffect(): void {
    const { hoveredEntityObj } = this;
    // If hover entity is null, hover effect is not active
    if (hoveredEntityObj) {
      const material = hoveredEntityObj.material as THREE.MeshBasicMaterial
      |THREE.MeshLambertMaterial;
      const { highlighted, defaultColor, highlightingColor } = hoveredEntityObj;

      // Restore normal color (depends on highlighting status)
      material.color = highlighted ? highlightingColor : defaultColor;
      // Indicate that no entity is currently hovered upon
      this.hoveredEntityObj = null;
    }
  }
}
