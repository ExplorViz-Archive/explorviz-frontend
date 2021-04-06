import Service, { inject as service } from '@ember/service';
import Configuration from 'explorviz-frontend/services/configuration';
import THREE from "three";
import FloorMesh from "../utils/view-objects/vr/floor-mesh";

const FLOOR_SIZE = 1000;

export default class VrSceneService extends Service {
  @service('configuration') private configuration!: Configuration;

  readonly scene: THREE.Scene;
  readonly floor: FloorMesh;

  constructor(properties?: object) {
    super(properties);

    // Initialize sceene.
    this.scene = new THREE.Scene();
    this.scene.background = this.configuration.landscapeColors.background;

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
}

declare module '@ember/service' {
  interface Registry {
    'vr-scene': VrSceneService;
  }
}
