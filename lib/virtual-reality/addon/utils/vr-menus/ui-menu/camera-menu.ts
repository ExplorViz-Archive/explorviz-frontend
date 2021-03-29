import VRController from '../../vr-controller';
import VRControllerButtonBinding from '../../vr-controller/vr-controller-button-binding';
import VRControllerThumbpadBinding from '../../vr-controller/vr-controller-thumbpad-binding';
import ArrowbuttonItem from '../items/arrowbutton-item';
import TextItem from '../items/text-item';
import TextbuttonItem from '../items/textbutton-item';
import UiMenu, { UiMenuArgs } from '../ui-menu';
import TitleItem from "../items/title-item";

/**
 * The maximum change of the camera's height per frame when the trigger is fully pressed.
 */
const MAX_TRANSLATE_SPEED = 0.02;

export type CameraMenuArgs = UiMenuArgs & {
  cameraObject3D: THREE.Object3D
};

export default class CameraMenu extends UiMenu {
  private cameraObject3D: THREE.Object3D;
  private resetButton: TextbuttonItem;
  private heightTextItem: TextItem;
  private heightUpButton: ArrowbuttonItem;
  private heightDownButton: ArrowbuttonItem;

  constructor({ cameraObject3D, ...args }: CameraMenuArgs) {
    super(args);
    this.cameraObject3D = cameraObject3D;

    const title = new TitleItem({
      text: 'Camera',
      position: { x: 256, y: 20 }
    });
    this.items.push(title);

    this.heightTextItem = new TextItem({
      text: this.cameraHeight.toFixed(2),
      color: '#ffffff',
      fontSize: 28,
      alignment: 'center',
      position: { x: 256, y: 202 },
    });
    this.items.push(this.heightTextItem);

    this.resetButton = new TextbuttonItem({
      text: 'Reset',
      position: { x: 420, y: 13, },
      width: 65,
      height: 40,
      fontSize: 22,
      buttonColor: '#aaaaaa',
      textColor: '#ffffff',
      hoverColor: '#dc3b00',
      onTriggerDown: () => this.resetCamera()
    });
    this.items.push(this.resetButton);

    this.heightDownButton = new ArrowbuttonItem({
      direction: 'down',
      position: { x: 100, y: 182 },
      width: 50,
      height: 60,
      onTriggerPressed: (value) => this.heightDown(value)
    });
    this.items.push(this.heightDownButton);

    this.heightUpButton = new ArrowbuttonItem({
      direction: 'up',
      position: { x: 366, y: 182 },
      width: 50,
      height: 60,
      onTriggerPressed: (value) => this.heightUp(value)
    });
    this.items.push(this.heightUpButton);

    this.redrawMenu();
  }

  private get cameraHeight(): number {
    return this.cameraObject3D.position.y;
  }

  private set cameraHeight(cameraHeight: number) {
    this.cameraObject3D.position.y = cameraHeight;
  }

  private translateCamera(deltaHeight: number) {
    this.cameraHeight = this.cameraHeight + deltaHeight;
    this.redrawMenu();
  }

  private resetCamera() {
    this.cameraHeight = 0;
    this.redrawMenu();
  }

  private heightDown(value: number) {
    this.translateCamera(-value * MAX_TRANSLATE_SPEED);
  }

  private heightUp(value: number) {
    this.translateCamera(value * MAX_TRANSLATE_SPEED);
  }

  makeGripButtonBinding() {
    return new VRControllerButtonBinding('Reset', {
      onButtonDown: () => { this.resetButton.enableHoverEffectByButton(); this.resetCamera(); },
      onButtonUp: () => { this.resetButton.resetHoverEffectByButton(); this.redrawMenu() }
    });
  }

  onThumbpadPress(_controller: VRController, axes: number[]) {
    this.heightDownButton.resetHoverEffectByButton();
    this.heightUpButton.resetHoverEffectByButton();
    if (axes[1] > 0) {
      this.heightUpButton.enableHoverEffectByButton();
      this.heightUp(axes[1]);
    } else {
      this.heightDownButton.enableHoverEffectByButton();
      this.heightDown(-axes[1]);
    }
  }

  onUpdateMenu(delta: number) {
    const text = this.cameraHeight.toFixed(2);
    if (text !== this.heightTextItem.text) {
      this.heightTextItem.text = text;
      this.redrawMenu();
    }

    super.onUpdateMenu(delta);
  }

  makeThumbpadBinding() {
    return new VRControllerThumbpadBinding({ labelUp: 'Up', labelDown: 'Down' }, {
      onThumbpadPress: (controller, axes) => this.onThumbpadPress(controller, axes),
      onThumbpadUp: () => {
        this.heightDownButton.resetHoverEffectByButton();
        this.heightUpButton.resetHoverEffectByButton();
        this.redrawMenu();
      }
    });
  }
}
