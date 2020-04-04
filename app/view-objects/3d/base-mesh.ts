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

  delete() {
    if (this.parent) {
      this.parent.remove(this);
    }

    if (this.geometry) {
      this.geometry.dispose();
    }
    if (this.material instanceof THREE.Material) {
      this.material.dispose();
    }

    // Recursively delete all child objects
    this.children.forEach((child) => {
      if (child instanceof BaseMesh) {
        child.delete();
      }
    });
  }
}
