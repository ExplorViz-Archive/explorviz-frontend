import UiMenu from "./ui-menu";

export const HUD_RENDER_ORDER = 1000;

/**
 * Base class for menus that should be rendered on top of the actual scene.
 */
export default class HudMenu extends UiMenu {
    constructor(resolution: { width: number, height: number } = { width: 512, height: 512 }, color = '#444444') {
        super(resolution, color);
        this.renderOrder = HUD_RENDER_ORDER;
    }

    makeBackgroundMaterial(color: THREE.Color) {
        const material = super.makeBackgroundMaterial(color);
        material.depthTest = false;
        return material;
    }
}