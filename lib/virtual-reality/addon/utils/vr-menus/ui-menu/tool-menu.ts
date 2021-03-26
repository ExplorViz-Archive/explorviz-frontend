import THREE from 'three';
import BaseMenu, { BaseMenuArgs } from '../base-menu';
import * as Helper from '../../vr-helpers/multi-user-helper';

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
const LABEL_FONT = '80px arial';

const TOOL_CIRCLE_RADIUS = 0.07;
const TOOL_CIRCLE_SEGMENTS = 32;
const TOOL_X_OFFSET = 0.02;

export default class ToolMenu extends BaseMenu {
  private tools: Tool[];
  private selectedToolIndex: number = -1;

  constructor(args: BaseMenuArgs) {
    super(args);
    this.tools = [];

    this.addTool({
      label: 'Zoom',
      icon: 'search',
      action: () => this.menuGroup?.openMenu(this.menuFactory.buildZoomMenu())
    });
    this.addTool({
      label: 'Ping',
      icon: 'north-star',
      action: () => this.menuGroup?.openMenu(this.menuFactory.buildPingMenu())
    });
    this.addTool({
      label: 'Options',
      icon: 'gear',
      action: () => this.menuGroup?.openMenu(this.menuFactory.buildMainMenu())
    });

    this.selectTool(0);
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
      group.add(labelMesh);
    }

    this.tools.push({
      object: group,
      action, 
      toggleSelect: (isSelected) => {
        backgroundMesh.material.opacity = isSelected ? 1.0 : 0.5;
        // labelMesh.visible = isSelected;
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
    // Choose texture size depending on text size.
    const textSize = Helper.getTextSize(label, LABEL_FONT);
    const width = textSize.width + LABEL_PADDING;
    const height = textSize.height + LABEL_PADDING;

    // Create canvas to draw texture.
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Fill background.
    ctx.fillStyle = `#${BACKGROUND_COLOR.getHexString()}`;
    ctx.fillRect(0, 0, width, height);

    // Draw text.
    ctx.font = LABEL_FONT;
    ctx.fillStyle = `#${FOREGROUND_COLOR.getHexString()}`;
    ctx.textAlign = 'center';
    ctx.fillText(label, width / 2, height - LABEL_PADDING / 2);

    // Set drawn texture as background.
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8,
    });

    const worldWidth = width / 512 * 0.15;
    const worldHeight = height / 512 * 0.15;
    const geometry = new THREE.PlaneGeometry(worldWidth, worldHeight);
    return new THREE.Mesh(geometry, material);
  }

  private selectTool(index: number) {
    // Unselect previous tool.
    if (this.selectedToolIndex >= 0) {
      this.tools[this.selectedToolIndex].toggleSelect(false);
    }
    
    // Select new current tool.
    this.selectedToolIndex = index % this.tools.length;
    this.tools[this.selectedToolIndex].toggleSelect(true);
  }
}
