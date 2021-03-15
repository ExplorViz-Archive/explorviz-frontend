
import THREE, { AnimationMixer, Color, Mesh, Scene } from "three";
import LocalVrUser from "virtual-reality/services/local-vr-user";
import VRControllerButtonBinding from "virtual-reality/utils/vr-controller/vr-controller-button-binding";
import VRController from "virtual-reality/utils/vr-rendering/VRController";
import AnimatedMenu from "../animated-menu";

const PING_ANIMATION_CLIP = new THREE.AnimationClip('ping-animation', 0.8, [
    new THREE.NumberKeyframeTrack('.scale[x]', [0.0, 0.8], [1.0, 2.6]),
    new THREE.NumberKeyframeTrack('.scale[y]', [0.0, 0.8], [1.0, 2.6]),
    new THREE.NumberKeyframeTrack('.scale[z]', [0.0, 0.8], [1.0, 2.6])
  ]);

export default class PingMenu extends AnimatedMenu {

    mesh: Mesh;

    scene: Scene;

    action: THREE.AnimationAction;

    static readonly radius = 0.02;

    static readonly segments = 32;

    constructor(localUser: LocalVrUser, scene: Scene) {
        super();

        this.scene = scene;
        let color = new Color('red');
        if (localUser.color) color = localUser.color;
        const geometry = new THREE.SphereGeometry(PingMenu.radius, PingMenu.segments, PingMenu.segments);
        const material = new THREE.MeshBasicMaterial({color});
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.visible = false;
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
            onButtonPress: (controller: VRController) => {
                this.updatePing(controller);
            },
            onButtonUp: () => {
                this.stopPing();
            }
        })
    }


}