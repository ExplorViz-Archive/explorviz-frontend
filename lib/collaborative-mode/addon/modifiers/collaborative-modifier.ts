import Modifier from 'ember-modifier';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { assert } from '@ember/debug';
import CollaborativeSettingsService from 'collaborative-mode/services/collaborative-settings-service';
import CollaborativeService from 'collaborative-mode/services/collaborative-service';
import { Click, CollaborativeEvents, CursorPosition, instanceOfIdentifiableMesh, Perspective } from 'collaborative-mode/utils/collaborative-data';
import THREE, { Vector3 } from 'three';
import adjustForObjectRotation from 'explorviz-frontend/utils/collaborative-util';
import { Position2D } from 'explorviz-frontend/modifiers/interaction-modifier';


interface IModifierArgs {
    positional: [],
    named: {
        camera: THREE.Camera,
        raycastObject3D: THREE.Object3D,
        mouseMove?(mesh?: THREE.Mesh): void,
        mouseStop?(mesh?: THREE.Mesh, mousePosition?: Position2D): void,
        mouseOut?(): void,
        onSingleClick?(mesh?: THREE.Mesh): void,
        onDoubleClick?(mesh?: THREE.Mesh): void,
        setPerspective?(position: { x: number, y: number, z: number }, rotation: { x: number, y: number, z: number }): void,
        repositionSphere?(vector: Vector3, user: string): void,
    }
}

export default class CollaborativeModifierModifier extends Modifier<IModifierArgs> {

    didInstall() {
        this.collaborativeService.on(CollaborativeEvents.SingleClick, this.receiveSingleClick);
        this.collaborativeService.on(CollaborativeEvents.DoubleClick, this.receiveDoubleClick);
        this.collaborativeService.on(CollaborativeEvents.MouseMove, this.receiveMouseMove);
        this.collaborativeService.on(CollaborativeEvents.MouseStop, this.receiveMouseStop);
        this.collaborativeService.on(CollaborativeEvents.MouseOut, this.receiveMouseOut);
        this.collaborativeService.on(CollaborativeEvents.Perspective, this.receivePerspective);
        this.collaborativeService.on(CollaborativeEvents.GetPerspective, this.sendPerspective);
    }

    willDestroy() {
        this.collaborativeService.off(CollaborativeEvents.SingleClick, this.receiveSingleClick);
        this.collaborativeService.off(CollaborativeEvents.DoubleClick, this.receiveDoubleClick);
        this.collaborativeService.off(CollaborativeEvents.MouseMove, this.receiveMouseMove);
        this.collaborativeService.off(CollaborativeEvents.MouseStop, this.receiveMouseStop);
        this.collaborativeService.off(CollaborativeEvents.MouseOut, this.receiveMouseOut);
        this.collaborativeService.off(CollaborativeEvents.Perspective, this.receivePerspective);
        this.collaborativeService.off(CollaborativeEvents.GetPerspective, this.sendPerspective);
    }

    @service('collaborative-settings-service')
    settings!: CollaborativeSettingsService;

    @service('collaborative-service')
    collaborativeService!: CollaborativeService;

    get canvas(): HTMLCanvasElement {
        assert(
            `Element must be 'HTMLCanvasElement' but was ${typeof this.element}`,
            this.element instanceof HTMLCanvasElement
        );
        return this.element;
    }
    get raycastObject3D(): THREE.Object3D {
        return this.args.named.raycastObject3D
    }

    get camera(): THREE.Camera {
        return this.args.named.camera;
    }

    @action
    receiveSingleClick(click: Click, user: string) {
        if (!this.args.named.onSingleClick || !this.settings.followSingleClick || this.settings.userInControl != user) { return; }

        var applicationMesh = this.getApplicationMeshByColabId(click.id)
        if (applicationMesh instanceof THREE.Mesh) {
            this.args.named.onSingleClick(applicationMesh);
        }
    }

    @action
    receiveDoubleClick(click: Click, user: string) {
        if (!this.args.named.onDoubleClick || !this.settings.followDoubleClick || this.settings.userInControl != user) { return; }

        var applicationMesh = this.getApplicationMeshByColabId(click.id)
        if (applicationMesh instanceof THREE.Mesh) {
            this.args.named.onDoubleClick(applicationMesh);
        }
    }

    @action
    receiveMouseMove(mouse: CursorPosition, user: string) {
        if (!this.args.named.mouseMove || !this.settings.followMouseMove || !mouse.point || !mouse.id) { return; }

        const vec = adjustForObjectRotation(mouse.point, this.raycastObject3D.quaternion);

        if (this.args.named.repositionSphere) {
            this.args.named.repositionSphere(vec, user);
        }

        if (this.settings.userInControl != user) { return; }
        var intersectedViewObj = this.getApplicationMeshByColabId(mouse.id);

        if (intersectedViewObj instanceof THREE.Mesh && this.settings.followMouseHover) {
            this.args.named.mouseMove(intersectedViewObj);
        } else {
            this.args.named.mouseMove();
        }
    }

    @action
    receiveMouseStop(mouse: CursorPosition, user: string) {
        if (!this.args.named.mouseStop || !this.settings.followMouseStop || !mouse.point || !mouse.id) { return; }
        if (this.settings.userInControl != user) { return; }
        const vec = adjustForObjectRotation(mouse.point, this.raycastObject3D.quaternion);

        var intersectedViewObj = this.getApplicationMeshByColabId(mouse.id);

        if (intersectedViewObj instanceof THREE.Mesh && this.settings.followMouseHover) {
            const mousePosition = this.calculateMousePosition(vec);
            this.args.named.mouseStop(intersectedViewObj, mousePosition);
        } else {
            this.args.named.mouseStop();
        }
    }

    @action
    receiveMouseOut() {
        if (this.args.named.mouseOut && this.settings.followMouseStop) {
            this.args.named.mouseOut();
        }
    }

    @action
    receivePerspective(perspective: Perspective, user: string) {
        if (this.args.named.setPerspective && (this.settings.followPerspective || perspective.requested || this.settings.userInControl != user)) {
            this.args.named.setPerspective(perspective.position, perspective.rotation);
        }
    }

    @action
    sendPerspective(_data: any, from: string) {
        this.collaborativeService.sendPerspective({
            position: { x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z },
            rotation: { x: this.raycastObject3D.rotation?.x, y: this.raycastObject3D.rotation?.y, z: this.raycastObject3D.rotation?.z },
            requested: true
        }, from);
    }

    calculateMousePosition(mouse: Vector3) {
        mouse.project(this.camera);
        mouse.x = Math.round((0.5 + mouse.x / 2) * (this.canvas.width / window.devicePixelRatio));
        mouse.y = Math.round((0.5 - mouse.y / 2) * (this.canvas.height / window.devicePixelRatio));

        const pointerX = mouse.x - 5;
        const pointerY = mouse.y - 5;
        return { x: pointerX, y: pointerY };
    }

    getApplicationMeshByColabId(colabId: String) {
        return this.raycastObject3D.children.find(obj => {
            if (instanceOfIdentifiableMesh(obj)) {
                return obj.colabId === colabId;
            }
            return false;
        })
    }
}
