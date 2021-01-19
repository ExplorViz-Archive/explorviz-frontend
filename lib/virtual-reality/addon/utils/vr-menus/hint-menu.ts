import THREE from 'three';
import BaseMenu from './base-menu';
import TextItem from './items/text-item';

const OPEN_ANIMATION_CLIP = new THREE.AnimationClip('open-animation', 0.75, [
  new THREE.KeyframeTrack('.scale[x]', [0.0, 0.75], [0.0, 1.0])
]);

const PULS_ANIMATION_CLIP = new THREE.AnimationClip('puls-animation', 0.25, [
  new THREE.KeyframeTrack('.position[z]', [0, 0.25], [-0.3, -0.315])
]);

const CLOSE_ANIMATION_CLIP = new THREE.AnimationClip('close-animation', 0.75, [
  new THREE.KeyframeTrack('.scale[x]', [0, 0.75], [1.0, 0.0])
]);

export default class HintMenu extends BaseMenu {
  constructor(title: string, text: string|null = null) {
    super({ width: 512, height: 128 }, '#002e4f');

    const titleItem = new TextItem(title, 'text', '#ffffff', { x: 256, y: 50 }, 28, 'center');
    this.items.push(titleItem);

    if (text) {
      titleItem.position.y = 25;
      const contentItem = new TextItem(text, 'text2', '#ffff00', { x: 256, y: 75 }, 28, 'center');
      this.items.push(contentItem);
    }

    this.position.x = 0.035;
    this.position.y = -0.1;
    this.position.z = -0.3;
    this.rotateX(-0.18);

    this.update();
  }

  makeBackgroundMaterial(color: THREE.Color) {
    const material = super.makeBackgroundMaterial(color);
    material.opacity = 0.7;
    return material;
  }

  async onOpenMenu() {
    super.onOpenMenu();

    // Play open animation.
    const openAction = this.animationMixer.clipAction(OPEN_ANIMATION_CLIP);
    openAction.setLoop(THREE.LoopOnce, 0);
    openAction.play();
    await this.waitForAnimation(openAction);

    // Play puls animation.
    const pulsAction = this.animationMixer.clipAction(PULS_ANIMATION_CLIP);
    pulsAction.setLoop(THREE.LoopPingPong, 4);
    pulsAction.play();
    await this.waitForAnimation(pulsAction);
    
    // Play close animation.
    const closeAction = this.animationMixer.clipAction(CLOSE_ANIMATION_CLIP);
    closeAction.setLoop(THREE.LoopOnce, 0);
    closeAction.clampWhenFinished = true;
    closeAction.play();
    await this.waitForAnimation(closeAction);

    this.closeMenu();
  }
}
