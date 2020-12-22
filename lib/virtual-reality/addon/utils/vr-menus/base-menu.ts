import THREE from 'three';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import Item from './items/item';
import InteractiveItem from './items/interactive-item';
import VRControllerBindings from '../vr-controller/vr-controller-bindings';
import VRControllerThumbpadBinding from '../vr-controller/vr-controller-thumbpad-binding';
import VRControllerButtonBinding from '../vr-controller/vr-controller-button-binding';
import MenuGroup from './menu-group';

export default abstract class BaseMenu extends BaseMesh {
  canvas!: HTMLCanvasElement;

  canvasMesh!: THREE.Mesh<THREE.Geometry | THREE.BufferGeometry, THREE.MeshBasicMaterial>;

  resolution: { width: number, height: number };

  items: Item[];

  lastHoveredItem: InteractiveItem|undefined;

  thumbpadTargets: InteractiveItem[];

  activeTarget: number|undefined;

  thumbpadAxis: number;


  get opacity() {
    return this.material.opacity;
  }

  set opacity(value: number) {
    this.material.opacity = value;
  }

  constructor(resolution: { width: number, height: number } = { width: 512, height: 512 }, color = '#444444') {
    super(new THREE.Color(color));

    this.resolution = resolution;
    this.items = [];
    this.thumbpadTargets = [];
    this.activeTarget = undefined;
    this.thumbpadAxis = 1;

    this.initGeometry();
    this.initMaterial();
    this.initCanvas();
  }

  initGeometry() {
    this.geometry = new THREE.PlaneGeometry(
      (this.resolution.width / 512) * 0.3,
      (this.resolution.height / 512) * 0.3,
    );
  }

  initMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      color: this.defaultColor,
      side: THREE.DoubleSide
    });
    this.material.transparent = true;
    this.material.opacity = 0.8;
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.resolution.width;
    this.canvas.height = this.resolution.height;

    // Create a mesh that displays the canvas as a texture. This is needed
    // such that the
    const geometry = this.geometry.clone();
    const material = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(this.canvas),
      depthTest: true
    });
    material.transparent = true;
    this.canvasMesh = new THREE.Mesh(geometry, material);

    // Move the mesh slightly in front of the background.
    this.canvasMesh.position.z = 0.001;
    this.add(this.canvasMesh);
  }

  update() {
    const { canvas } = this;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      item.drawToCanvas(ctx);
    }

    if (this.canvasMesh.material.map) {
      this.canvasMesh.material.map.needsUpdate = true;
    }
  }

  hover(uv: THREE.Vector2) {
    this.activeTarget = undefined;
    const item = this.getItem(uv) as InteractiveItem|undefined;

    if (this.lastHoveredItem && !item) {
      this.lastHoveredItem.resetHoverEffect();
      this.lastHoveredItem = undefined;
    } else if (this.lastHoveredItem && item && this.lastHoveredItem !== item) {
      this.lastHoveredItem.resetHoverEffect();
      item.enableHoverEffect();
      this.lastHoveredItem = item;
    } else if (!this.lastHoveredItem && item) {
      item.enableHoverEffect();
      this.lastHoveredItem = item;
    }

    this.update();
  }

  // eslint-disable-next-line
  applyHoverEffect() {}

  resetHoverEffect() {
    if (this.lastHoveredItem) {
      this.lastHoveredItem.resetHoverEffect();
      this.lastHoveredItem = undefined;
    }

    this.update();
  }

  getPrevious() {
    if (typeof this.activeTarget === 'undefined' || this.activeTarget === 0) return this.thumbpadTargets.length - 1;
    return this.activeTarget - 1;
  }

  getNext() {
    if (typeof this.activeTarget === 'undefined' || this.activeTarget === this.thumbpadTargets.length - 1) return 0;
    return this.activeTarget + 1;
  }

  makeThumbpadBinding() {
    if (this.thumbpadTargets.length == 0) {
      return undefined;
    }
    return new VRControllerThumbpadBinding(
      this.thumbpadAxis === 0 
        ? {labelLeft: 'Previous', labelRight: 'Next'} 
        : {labelUp: 'Previous', labelDown: 'Next'}, 
      {
        onThumbpadDown: (_controller, axes) => {
          let direction = VRControllerThumbpadBinding.getDirection(axes);
          if (direction === 'right' && this.thumbpadAxis === 0 ||
              direction === 'down' && this.thumbpadAxis === 1) {
            this.activeTarget = this.getNext();
          } else if (direction === 'left' && this.thumbpadAxis === 0 ||
                     direction === 'up' && this.thumbpadAxis === 1) {
            this.activeTarget = this.getPrevious();
          } else {
            return;
          }
          this.lastHoveredItem?.resetHoverEffect()
          this.lastHoveredItem = undefined;
          const item = this.thumbpadTargets[this.activeTarget];
          item.enableHoverEffect();
          this.lastHoveredItem = item;
          this.update();
        }
      }
    );
  }

  makeTriggerButtonBinding() {
    if (this.thumbpadTargets.length == 0) {
      return undefined;
    }
    return new VRControllerButtonBinding('Select', {
        onButtonDown: () => {
          if (!(typeof this.activeTarget === 'undefined')) this.thumbpadTargets[this.activeTarget].onTriggerDown?.call(this.thumbpadTargets[this.activeTarget]);
        }
    })
  }

  triggerDown(uv: THREE.Vector2) {
    const item = this.getItem(uv) as InteractiveItem|undefined;

    if (item && item.onTriggerDown) {
      item.onTriggerDown();
    }
  }

  triggerPress(uv: THREE.Vector2, value: number) {
    const item = this.getItem(uv) as InteractiveItem|undefined;

    if (item && item.onTriggerPressed) {
      item.onTriggerPressed(value);
    }
  }

  makeGripButtonBinding(): VRControllerButtonBinding<undefined>|undefined {
    return undefined;
  }

  makeMenuButtonBinding(): VRControllerButtonBinding<undefined>|undefined {
    return new VRControllerButtonBinding('Back', {
      onButtonDown: this.closeMenu.bind(this)
    });
  }

  makeControllerBindings(): VRControllerBindings {
    return new VRControllerBindings({
      thumbpad: this.makeThumbpadBinding(),
      triggerButton: this.makeTriggerButtonBinding(),
      gripButton: this.makeGripButtonBinding(),
      menuButton: this.makeMenuButtonBinding()
    });
  }

  /**
   * Whether the controller's ray should be shown when this menu is open.
   *
   * By default, the controller's ray is hidden since the controller cannot
   * be used to interact with the environment while a menu is open. If the
   * controller bindings are overridden by a subclass such that the controller
   * can interact with the environment again, this getter should be overridden
   * as well.
   */
  get enableControllerRay(): boolean {
    return false;
  }

  /**
   * Finds the menu item at given uv position.
   *
   * @param position - The uv position.
   *
   * @returns Item at given position if there is one, else undefined.
   */
  getItem(position: THREE.Vector2, onlyInteractiveItems = true) {
    const items = onlyInteractiveItems
      ? this.items.filter((item) => item instanceof InteractiveItem)
      : this.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // calculate pixel position
      const x = this.resolution.width * position.x;
      const y = this.resolution.height - (this.resolution.height * position.y);

      const {
        minX,
        minY,
        maxX,
        maxY,
      } = item.getBoundingBox();

      if (x >= minX && y >= minY && x <= maxX && y <= maxY) {
        return item;
      }
    }
    return undefined;
  }

  getItemById(id: string) {
    return this.items.find((item) => item.id === id);
  }

  closeMenu() {
    if (this.parent instanceof MenuGroup) {
      this.parent.closeMenu();
    }
  }

  updateMenu() {}

  onClose() {}
}
