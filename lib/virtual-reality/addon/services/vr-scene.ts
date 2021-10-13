import Service, { inject as service } from '@ember/service';
import Configuration from 'explorviz-frontend/services/configuration';
import VrApplicationRenderer from 'explorviz-frontend/services/vr-application-renderer';
import VrLandscapeRenderer from 'explorviz-frontend/services/vr-landscape-renderer';
import THREE from 'three';
import {
  APPLICATION_ENTITY_TYPE, CLASS_COMMUNICATION_ENTITY_TYPE, CLASS_ENTITY_TYPE,
  COMPONENT_ENTITY_TYPE, EntityType, NODE_ENTITY_TYPE,
} from 'virtual-reality/utils/vr-message/util/entity_type';
import FloorMesh from '../utils/view-objects/vr/floor-mesh';

const FLOOR_SIZE = 1000;

export default class VrSceneService extends Service {
  @service('configuration')
  private configuration!: Configuration;

  @service('vr-application-renderer')
  private vrApplicationRenderer!: VrApplicationRenderer;

  @service('vr-landscape-renderer')
  private vrLandscapeRenderer!: VrLandscapeRenderer;

  readonly scene: THREE.Scene;

  readonly floor: FloorMesh;

  constructor(properties?: object) {
    super(properties);

    // Initialize sceene.
    this.scene = new THREE.Scene();
    this.scene.background = this.configuration.landscapeColors.backgroundColor;

    // Initilize floor.
    this.floor = new FloorMesh(FLOOR_SIZE, FLOOR_SIZE);
    this.scene.add(this.floor);

    // Initialize lights.
    const spotLight = new THREE.SpotLight(0xffffff, 0.5, 1000, 1.56, 0, 0);
    spotLight.position.set(100, 100, 100);
    spotLight.castShadow = false;
    this.scene.add(spotLight);

    const light = new THREE.AmbientLight(new THREE.Color(0.65, 0.65, 0.65));
    this.scene.add(light);

    // Add a light that illuminates the sky box if the user dragged in a backgound image.
    const skyLight = new THREE.SpotLight(0xffffff, 0.5, 1000, Math.PI, 0, 0);
    skyLight.castShadow = false;
    this.scene.add(skyLight);
  }

  findMeshByModelId(entityType: EntityType, id: string) {
    switch (entityType) {
      case NODE_ENTITY_TYPE:
      case APPLICATION_ENTITY_TYPE:
        return this.vrLandscapeRenderer.landscapeObject3D.getMeshbyModelId(id);

      case COMPONENT_ENTITY_TYPE:
      case CLASS_ENTITY_TYPE:
        return this.getBoxMeshByModelId(id);

      case CLASS_COMMUNICATION_ENTITY_TYPE:
        return this.getCommunicationMeshById(id);

      default:
        return null;
    }
  }

  private getCommunicationMeshById(id: string) {
    const openApplications = this.vrApplicationRenderer.getOpenApplications();
    for (let i = 0; i < openApplications.length; i++) {
      const application = openApplications[i];
      const mesh = application.getCommMeshByModelId(id);
      if (mesh) return mesh;
    }
    return null;
  }

  private getBoxMeshByModelId(id: string) {
    const openApplications = this.vrApplicationRenderer.getOpenApplications();

    for (let i = 0; i < openApplications.length; i++) {
      const application = openApplications[i];
      const mesh = application.getBoxMeshbyModelId(id);
      if (mesh) return mesh;
    }
    return null;
  }
}

declare module '@ember/service' {
  interface Registry {
    'vr-scene': VrSceneService;
  }
}
