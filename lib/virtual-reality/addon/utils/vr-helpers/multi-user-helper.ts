import THREE from 'three';

export function measureText(text: string, {font, alignment, baseline}: {
  font: string,
  alignment: CanvasTextAlign,
  baseline: CanvasTextBaseline
}): TextMetrics {
  // re-use canvas object for better performance
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw `failed to measure text: ${text}`;

  ctx.font = font;
  ctx.textAlign = alignment;
  ctx.textBaseline = baseline;
  return ctx.measureText(text);
}

/**
 * Sets MeshStandardMaterial of given object to have the given opacity.
 * Displays object using wireframes (instead of polygons):
 */
export function displayAsWireframe(object: THREE.Object3D, frameLineWidth = 0.5, opacity = 0.1) {
  if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
    object.material.wireframe = true;
    object.material.wireframeLinewidth = frameLineWidth;

    if (opacity < 1) {
      object.material.transparent = true;
      object.material.opacity = opacity;
    }
  }

  object.children.forEach((child) => {
    displayAsWireframe(child);
  });
}

/**
 * Sets MeshStandardMaterial of given object to have the given opacity.
 * Displays object using polygons (instead of wireframe):
 */
export function displayAsSolidObject(object: THREE.Object3D, opacity = 1) {
  if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
    object.material.wireframe = false;

    object.material.transparent = opacity !== 1;
    object.material.opacity = opacity;
  }

  object.children.forEach((child) => {
    displayAsSolidObject(child);
  });
}
