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
import EventSettingsService from 'collaborative-mode/services/event-settings-service';


interface IModifierArgs {
    positional: [],
    named: {
        camera: THREE.Camera,
        raycastObject3D: THREE.Object3D,
        mouseMove?(mesh?: THREE.Object3D): void,
        mouseStop?(mesh?: THREE.Object3D, mousePosition?: Position2D): void,
        mouseOut?(): void,
        onSingleClick?(mesh?: THREE.Object3D): void,
        onDoubleClick?(mesh?: THREE.Object3D): void,
        setPerspective?(position: number[], rotation: number[]): void,
        repositionSphere?(vector: Vector3, user: string, color: string): void,
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
    }

    willDestroy() {
        this.collaborativeService.off(CollaborativeEvents.SingleClick, this.receiveSingleClick);
        this.collaborativeService.off(CollaborativeEvents.DoubleClick, this.receiveDoubleClick);
        this.collaborativeService.off(CollaborativeEvents.MouseMove, this.receiveMouseMove);
        this.collaborativeService.off(CollaborativeEvents.MouseStop, this.receiveMouseStop);
        this.collaborativeService.off(CollaborativeEvents.MouseOut, this.receiveMouseOut);
        this.collaborativeService.off(CollaborativeEvents.Perspective, this.receivePerspective);
    }

    @service('collaborative-settings-service')
    settings!: CollaborativeSettingsService;

    @service('collaborative-service')
    collaborativeService!: CollaborativeService;

    @service('event-settings-service')
    eventSettings!: EventSettingsService;


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
    receiveSingleClick(click: Click) {
        if (!this.args.named.onSingleClick || this.settings.userInControl != click.user) { return; }
        if (!this.settings.watching && !this.eventSettings.singleClick) {return}

        var applicationMesh = this.getApplicationMeshByColabId(click.id)
        this.args.named.onSingleClick(applicationMesh);
    }

    @action
    receiveDoubleClick(click: Click) {
        if (!this.args.named.onDoubleClick || this.settings.userInControl != click.user) { return; }
        if (!this.settings.watching && !this.eventSettings.doubleClick ) { return; }

        var applicationMesh = this.getApplicationMeshByColabId(click.id)
        this.args.named.onDoubleClick(applicationMesh);
    }

    @action
    receiveMouseMove(mouse: CursorPosition) {
        if (!this.args.named.mouseMove || !mouse.id) { return; }
        if (!this.settings.watching && !this.eventSettings.mouseMove ) { return; }

        const user = mouse.user
        const vec = adjustForObjectRotation(mouse.point, this.raycastObject3D.quaternion);
        if (this.args.named.repositionSphere) {
            var userObj = this.settings.meeting?.users.find(obj => {
                return obj.name == mouse.user
            })

            this.args.named.repositionSphere(vec, user!, userObj!.color);
        }

        if (this.settings.userInControl != mouse.user) { return; }
        var intersectedViewObj = this.getApplicationMeshByColabId(mouse.id);

        if (this.eventSettings.mouseHover) {
            this.args.named.mouseMove(intersectedViewObj);
        }
    }

    @action
    receiveMouseStop(mouse: CursorPosition) {
        if (!this.args.named.mouseStop || !mouse.id) { return; }
        if (!this.settings.watching && !this.eventSettings.mouseStop ) { return; }
        if (this.settings.userInControl != mouse.user) { return; }

        const vec = adjustForObjectRotation(mouse.point, this.raycastObject3D.quaternion);

        var intersectedViewObj = this.getApplicationMeshByColabId(mouse.id);

        if (this.eventSettings.mouseHover) {
            const mousePosition = this.calculateMousePosition(vec);
            this.args.named.mouseStop(intersectedViewObj, mousePosition);
        }
    }

    @action
    receiveMouseOut() {
        if (!this.args.named.mouseOut) { return }
        if (!this.settings.watching && !this.eventSettings.mouseOut) { return }

        this.args.named.mouseOut();
    }

    @action
    receivePerspective(perspective: Perspective) {
        if (!this.args.named.setPerspective) {return}
        if (!perspective.requested && !this.settings.watching && !this.eventSettings.perspective) {return } 
        if (!perspective.requested && this.settings.userInControl != perspective.user) { return; }

        this.args.named.setPerspective(perspective.position, perspective.rotation);
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
