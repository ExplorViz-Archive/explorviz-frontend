import CollaborativeService from "collaborative-mode/services/collaborative-service";
import CollaborativeSettingsService from "collaborative-mode/services/collaborative-settings-service";
import Interaction, { CallbackFunctions } from "explorviz-frontend/utils/interaction";
import THREE, { Vector3 } from "three";
import { CursorPosition, instanceOfIdentifiableMesh } from "./collaborative-data";
import adjustForObjectRotation from "./collaborative-util";

export type CollaborativeCallbackFunctions = {
  repositionSphere?(vector: Vector3): void,
}
export default class CollaborativeInteraction extends Interaction {

  collaborativeCallbacks: CollaborativeCallbackFunctions;
  settings: CollaborativeSettingsService;

  constructor(canvas: HTMLCanvasElement, camera: THREE.Camera, renderer: THREE.WebGLRenderer,
    application: THREE.Object3D, collaborativeService: CollaborativeService, eventCallbackFunctions: CallbackFunctions, collaborativeCallbacks: CollaborativeCallbackFunctions, collaborativeSettingsService: CollaborativeSettingsService) {
    super(canvas, camera, renderer, application, collaborativeService, eventCallbackFunctions);
    this.collaborativeCallbacks = collaborativeCallbacks;
    this.settings = collaborativeSettingsService;
  }

  receiveMouseStop(mouse: CursorPosition) {
    if (!this.eventCallbackFunctions.mouseStop || !mouse.point || !mouse.id) { return; }

    const vec = adjustForObjectRotation(mouse.point, this.raycastObject3D.quaternion);

    var intersectedViewObj = this.getApplicationMeshByColabId(mouse.id);

    if (intersectedViewObj instanceof THREE.Mesh && this.settings.mouseHover) {
      const mousePosition = this.calculateMousePosition(vec);
      this.eventCallbackFunctions.mouseStop(intersectedViewObj, mousePosition);
    } else {
      this.eventCallbackFunctions.mouseStop();
    }
  }

  receiveMouseMove(mouse: CursorPosition) {
    if (!this.eventCallbackFunctions.mouseMove || !mouse.point || !mouse.id) { return; }

    const vec = adjustForObjectRotation(mouse.point, this.raycastObject3D.quaternion);
    if (this.collaborativeCallbacks.repositionSphere) {
      this.collaborativeCallbacks.repositionSphere(vec);
    }
    var intersectedViewObj = this.getApplicationMeshByColabId(mouse.id);

    console.log("This hoverL " + this.settings.mouseHover)
    if (intersectedViewObj instanceof THREE.Mesh && this.settings.mouseHover) {
      this.eventCallbackFunctions.mouseMove(intersectedViewObj);
    } else {
      this.eventCallbackFunctions.mouseMove();
    }
  }
  
  calculateMousePosition(mouse: Vector3) {
    mouse.project(this.camera);
    mouse.x = Math.round((0.5 + mouse.x / 2) * (this.renderer.domElement.width / window.devicePixelRatio));
    mouse.y = Math.round((0.5 - mouse.y / 2) * (this.renderer.domElement.height / window.devicePixelRatio));

    const pointerX = mouse.x - 5;
    const pointerY = mouse.y - 5;
    return {x: pointerX, y: pointerY};
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