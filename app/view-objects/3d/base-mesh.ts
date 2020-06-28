import THREE from 'three';


export default abstract class BaseMesh extends THREE.Mesh {
  highlighted: boolean = false;

  defaultColor: THREE.Color;

  highlightingColor: THREE.Color;


  constructor(defaultColor: THREE.Color, highlightingColor = new THREE.Color('red')) {
    super();
    this.defaultColor = defaultColor;
    this.highlightingColor = highlightingColor;
  }

  highlight() {
    this.highlighted = true;
    if (this.material instanceof THREE.MeshLambertMaterial
      || this.material instanceof THREE.MeshBasicMaterial) {
      this.material.color = this.highlightingColor;
    }
  }

  unhighlight() {
    this.highlighted = false;
    if (this.material instanceof THREE.MeshLambertMaterial
      || this.material instanceof THREE.MeshBasicMaterial) {
      this.material.color = this.defaultColor;
      this.turnOpaque();
    }
  }

  updateColor() {
    if (this.material instanceof THREE.MeshLambertMaterial
      || this.material instanceof THREE.MeshBasicMaterial) {
      if (this.highlighted) {
        this.material.color = this.highlightingColor;
      } else {
        this.material.color = this.defaultColor;
      }
    }
  }

  changeOpacity(opacity: number) {
    const isTransparent = opacity < 1;
    if (this.material instanceof THREE.Material) {
      this.material.opacity = opacity;
      this.material.transparent = isTransparent;
    }
  }

  turnOpaque() {
    this.changeOpacity(1.0);
  }

  turnTransparent(opacity = 0.3) {
    this.changeOpacity(opacity);
  }

  deleteFromParent() {
    if (this.parent) {
      this.parent.remove(this);
    }
  }

  /**
   * Disposes the mesh's geometry and material
   * and does so recursively for the child BaseMeshes
   */
  disposeRecursively() {
    this.traverse((child) => {
      if (child instanceof BaseMesh) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        } else {
          for (let j = 0; j < child.material.length; j++) {
            const material = child.material[j];
            material.dispose();
          }
        }
      }
    });
  }
}
