import THREE from "three";

/**
 * The width of the texture in pixel.
 */
const WIDTH = 32;

/**
 * The height of the texture in pixel.
 */
const HEIGHT = 32;

/**
 * The width and height of the sprite in meter.
 */
const SIZE = 0.01;

export default class WaypointIndicator extends THREE.Sprite {
    constructor({color}: {color: string}) {
        super();
        this.initSpriteTexture(color);

        // Scale and position the indicator such that it is in front of the
        // camera. 
        this.position.x = 0.1;
        this.position.z = -0.3;
        this.scale.set(SIZE, SIZE, 1.0);

        // ...
        const target = new THREE.Vector3(0, 0, 0);
        this.onBeforeRender = (_renderer, _scene, camera) => {
            // Convert world coordinates of target to normalized device coordinates.
            const projectedTarget = target.clone().project(camera);
            const behind = projectedTarget.z > 1.0;
            projectedTarget.z = 0;
            projectedTarget.normalize().multiplyScalar(0.1);

            // When the normalized z coordinate is greter than one, the target
            // is behind the camera and the sign of the x and y coordinates is
            // inverted.
            let {x, y} = projectedTarget;
            if (behind) {
                x = -x;
                y = -y;
            }

            // Rotate the arrow.
            const angle = Math.atan2(y, x);
            this.position.x = x;
            this.position.y = y;
            this.material.rotation = angle;
        };
    }

    /**
     * Draws the texture of the sprite.
     * 
     * The sprite's texture shows a right pointing triangle in the given color. 
     */
    initSpriteTexture(color: string) {
        const canvas = document.createElement('canvas');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(WIDTH, HEIGHT/2);
            ctx.lineTo(0, HEIGHT);
            ctx.arcTo(16, 16, 0, 0, 16);
            ctx.fill();
        }

        this.material = new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(canvas)
        });
    }
}