
import THREE, { AnimationMixer, Color, Mesh, Scene } from "three";
import LocalVrUser from "virtual-reality/services/local-vr-user";
import VRControllerButtonBinding from "virtual-reality/utils/vr-controller/vr-controller-button-binding";
import VrMessageSender from "virtual-reality/utils/vr-message/sender";
import VRController from "virtual-reality/utils/vr-rendering/VRController";
import AnimatedMenu from "../animated-menu";

export const PING_ANIMATION_CLIP = new THREE.AnimationClip('ping-animation', 0.5, [
    new THREE.NumberKeyframeTrack('.scale[x]', [0.0, 0.5], [1.0, 2.6]),
    new THREE.NumberKeyframeTrack('.scale[y]', [0.0, 0.5], [1.0, 2.6]),
    new THREE.NumberKeyframeTrack('.scale[z]', [0.0, 0.5], [1.0, 2.6])
  ]);

<<<<<<< HEAD:lib/virtual-reality/addon/utils/vr-menus/pseudo-menu/ping-menu.ts
const PING_RADIUS = 0.02;

const PING_SEGMENTS = 32

export function getPingMesh(color: Color): Mesh {
        const geometry = new THREE.SphereGeometry(PING_RADIUS, PING_SEGMENTS, PING_SEGMENTS);
        const material = new THREE.MeshBasicMaterial({color});
        let mesh = new THREE.Mesh(geometry, material);
        mesh.visible = false;
        return mesh;
}

export default class PingMenu extends PseudoMenu {
=======
export default class PingMenu extends AnimatedMenu {
>>>>>>> 2c0ba9dfff2780fa583dbc7aa3280b049c24f19b:lib/virtual-reality/addon/utils/vr-menus/ui-less-menu/ping-menu.ts

    mesh: Mesh;

    scene: Scene;

    action: THREE.AnimationAction;

    sender: VrMessageSender;

    constructor(localUser: LocalVrUser, scene: Scene, sender: VrMessageSender) {
        super();

        this.scene = scene;
        this.sender = sender;
        let color = new Color('red');
        if (localUser.color) color = localUser.color;
        this.mesh = getPingMesh(color);
        this.scene.add(this.mesh);

        this.animationMixer = new AnimationMixer(this.mesh);
        this.action = this.animationMixer.clipAction(PING_ANIMATION_CLIP);
    }

    updatePing(controller: VRController) {
        controller.updateIntersectedObject();
        const intersectedObject = controller.intersectedObject;

        if (intersectedObject) {
            const position = intersectedObject.point;
            this.mesh.position.set(position.x, position.y, position.z);
            this.mesh.visible = true;
            this.action.play();
        } else {
            this.action.stop();
            this.mesh.visible = false;
        }
    }

    stopPing() {
        this.action.stop();
        this.mesh.visible = false;
    }

    get enableControllerRay() {
        return true;
    }

    get enableTeleport() {
        return false;
    }

    onCloseMenu() {
        this.scene.remove(this.mesh);
    }

    makeTriggerButtonBinding() {
        return new VRControllerButtonBinding('Ping', {
            onButtonDown: (controller: VRController) => {
                this.sender.sendPingUpdate(controller.gamepadIndex, true)
            },
            onButtonPress: (controller: VRController) => {
                this.updatePing(controller);
            },
            onButtonUp: (controller: VRController) => {
                this.stopPing();
                this.sender.sendPingUpdate(controller.gamepadIndex, false);
            }
        })
    }


}