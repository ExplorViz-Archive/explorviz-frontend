import THREE from 'three';
import { BaseMenuArgs } from '../base-menu';
import TextTexture from 'virtual-reality/utils/vr-helpers/text-texture';
import { SIZE_RESOLUTION_FACTOR } from '../ui-menu';
import InteractiveMenu from '../interactive-menu';
import VRControllerThumbpadBinding from "../../vr-controller/vr-controller-thumbpad-binding";
import VRControllerButtonBinding from "../../vr-controller/vr-controller-button-binding";

type OpticonIconName = string;

type ToolArgs = {
  label: string,
  icon: OpticonIconName,
  action: () => void
};

type Tool = {
  object: THREE.Object3D,
  action: () => void,
  toggleSelect: (isSelected: boolean) => void
};

const FOREGROUND_COLOR = new THREE.Color(0xFFFFFF);
const BACKGROUND_COLOR = new THREE.Color(0x444444);

const LABEL_PADDING = 80;
const LABEL_OFFSET = 0.025;
const LABEL_FONT_SIZE = 80;
const LABEL_FONT_FAMILY = 'arial';

const TOOL_CIRCLE_RADIUS = 0.07;
const TOOL_CIRCLE_SEGMENTS = 32;
const TOOL_X_OFFSET = 0.02;

const SELECT_ANIMATION_DURATION = 0.2;

const THUMBPAD_THRESHOLD = 0.5;

export default class ToolMenu extends InteractiveMenu {
  private tools: Tool[];
  private defaultToolIndex: number = 0;
  private selectedToolIndex: number = -1;
  private currentAnimation: THREE.AnimationAction | null;

  constructor(args: BaseMenuArgs) {
    super(args);
    this.tools = [];
    this.currentAnimation = null;

    this.addTool({
      label: 'Zoom',
      icon: 'search',
      action: () => this.menuGroup?.replaceMenu(this.menuFactory.buildZoomMenu())
    });
    this.addDefaultTool({
      label: 'Options',
      icon: 'gear',
      action: () => this.menuGroup?.replaceMenu(this.menuFactory.buildMainMenu())
    });
    this.addTool({
      label: 'Ping',
      icon: 'north-star',
      action: () => this.menuGroup?.replaceMenu(this.menuFactory.buildPingMenu())
    });

    this.selectTool(this.defaultToolIndex, {enableAnimation: false});
  }

  private get selectedTool(): Tool {
    return this.tools[this.selectedToolIndex];
  }

  private addDefaultTool(args: ToolArgs) {
    this.addTool(args);
    this.defaultToolIndex = this.tools.length - 1;
  }

  private addTool({label, icon, action}: ToolArgs) {
    const group = new THREE.Group();
    this.add(group);
    group.position.x = this.tools.length * (TOOL_X_OFFSET + 2 * TOOL_CIRCLE_RADIUS);

    const backgroundMesh = this.buildBackgroundMesh();
    group.add(backgroundMesh);

    const labelMesh = this.buildLabelMesh(label);
    if (labelMesh) {
      labelMesh.position.y = -(LABEL_OFFSET + TOOL_CIRCLE_RADIUS);
      labelMesh.visible = false;
      group.add(labelMesh);
    }

    this.tools.push({
      object: group,
      action,
      toggleSelect: (isSelected) => {
        backgroundMesh.material.opacity = isSelected ? 0.8 : 0.5;
        labelMesh.visible = isSelected;
      }
    });
  }

  private buildBackgroundMesh() {
    const geometry = new THREE.CircleGeometry(TOOL_CIRCLE_RADIUS, TOOL_CIRCLE_SEGMENTS);
    const material = new THREE.MeshBasicMaterial({
      color: BACKGROUND_COLOR,
      side: THREE.DoubleSide,
      opacity: 0.5,
      transparent: true
    });
    return new THREE.Mesh(geometry, material);
  }

  private buildLabelMesh(label: string) {
    const texture = new TextTexture({
      text: label,
      textColor: FOREGROUND_COLOR,
      fontSize: LABEL_FONT_SIZE,
      fontFamily: LABEL_FONT_FAMILY,
      padding: LABEL_PADDING,
      backgroundColor: BACKGROUND_COLOR
    });
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8,
    });

    const worldWidth = texture.image.width * SIZE_RESOLUTION_FACTOR / 2;
    const worldHeight = texture.image.height * SIZE_RESOLUTION_FACTOR / 2;
    const geometry = new THREE.PlaneGeometry(worldWidth, worldHeight);
    return new THREE.Mesh(geometry, material);
  }

  private async selectTool(index: number, {enableAnimation = true}: {
    enableAnimation?: boolean
  } = {}) {
    // While an animation is playing, no other tool can be selected.
    if (this.currentAnimation) return;

    // A tool can only be selected if the index is in range.
    if (index < 0 || index >= this.tools.length) return;

    // Unselect previous tool unless this is the initially selected tool.
    if (this.selectedToolIndex >= 0) {
      this.selectedTool.toggleSelect(false);
    }

    // Select new current tool.
    this.selectedToolIndex = index;
    this.selectedTool.toggleSelect(true);

    // Animate the selected tool to the center if animations are enabled.
    const targetPositionX = -this.selectedTool.object.position.x;
    if (enableAnimation) {
      this.currentAnimation = this.animationMixer.clipAction(new THREE.AnimationClip(
        'select-animation',
        SELECT_ANIMATION_DURATION, [
          new THREE.KeyframeTrack(
            '.position[x]',
            [0.0, SELECT_ANIMATION_DURATION],
            [this.position.x, targetPositionX]
          )
        ]));
      this.currentAnimation.setLoop(THREE.LoopOnce, 0);
      this.currentAnimation.clampWhenFinished = true;
      this.currentAnimation.play();

      // Wait for animation to finish. Since the animation is clamped, it has
      // to be stopped explicitly. Clamping the animation avoids it to snap back
      // to the original value before it is set to the target value below.
      await this.waitForAnimation(this.currentAnimation);
      this.currentAnimation.stop();
      this.currentAnimation = null;
    }

    // Apply target value when animations are not enabled or when the animation is done.
    this.position.x = targetPositionX;
  }

  private selectPreviousTool() {
    this.selectTool(this.selectedToolIndex - 1);
  }

  private selectNextTool() {
    this.selectTool(this.selectedToolIndex + 1);
  }

  triggerDown(intersection: THREE.Intersection) {
    super.triggerDown(intersection);

    // Select clicked tool or run its action if it is selected already.
    const tool = this.findToolByObject(intersection.object);
    if (tool) {
      const index = this.tools.indexOf(tool);
      if (index == this.selectedToolIndex) {
        this.selectedTool.action();
      } else {
        this.selectTool(index);
      }
    }
  }

  makeThumbpadBinding() {
    return new VRControllerThumbpadBinding({ labelUp: 'Previous', labelDown: 'Next' }, {
      onThumbpadTouch: (_controller, axes) => {
        if (axes[0] <= -THUMBPAD_THRESHOLD) this.selectPreviousTool();
        if (axes[0] >= THUMBPAD_THRESHOLD) this.selectNextTool();
      }
    });
  }

  makeTriggerBinding() {
    return new VRControllerButtonBinding('Select', {
      onButtonDown: (_controller) => this.selectedTool.action()
    });
  }

  /**
   * Finds the tool that contains the given object.
   */
  private findToolByObject(object: THREE.Object3D): Tool | null {
    for (let tool of this.tools) {
      let current: THREE.Object3D | null = object;
      while (current) {
        if (current === tool.object) return tool;
        current = current.parent;
      }
    }
    return null;
  }
}
