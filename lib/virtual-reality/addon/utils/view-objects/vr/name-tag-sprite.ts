import THREE from 'three';
import * as Helper from '../../vr-helpers/multi-user-helper';

const PADDING = 20;
const SIZE_PER_PIXEL = 1 / 500;

export default class NameTagSprite extends THREE.Sprite {
  canvas: HTMLCanvasElement;

  constructor(username: string, color: THREE.Color) {
    super();

    // Choose texture size depending on text size.
    const textSize = Helper.getTextSize(username, '30px arial');
    const width = textSize.width + PADDING;
    const height = textSize.height + PADDING;

    // Create canvas to draw texture.
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    // Fill background.
    ctx.fillStyle = 'rgba(200, 200, 216, 0.5)'; // Light grey
    ctx.fillRect(0, 0, width, height);

    // Draw text.
    ctx.font = '30px arial';
    ctx.fillStyle = `#${color.getHexString()}`; // Username is colored in corresponding color
    ctx.textAlign = 'center';
    ctx.fillText(username, width / 2, height - PADDING / 2);

    // Set drawn texture as background.
    const texture = new THREE.Texture(this.canvas);
    texture.needsUpdate = true;
    this.material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8,
    });

    // Scale name tag.
    this.scale.set(width * SIZE_PER_PIXEL, height * SIZE_PER_PIXEL, 1.0);
  }
}
