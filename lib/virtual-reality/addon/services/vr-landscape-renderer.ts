import Service, { inject as service } from '@ember/service';
import ElkConstructor, { ELK, ElkNode } from 'elkjs/lib/elk-api';
import { restartableTask } from 'ember-concurrency-decorators';
import { perform } from 'ember-concurrency-ts';
import debugLogger from 'ember-debug-logger';
import LandscapeRendering, { Layout1Return, Layout3Return } from 'explorviz-frontend/components/visualization/rendering/landscape-rendering';
import ArSettings from 'explorviz-frontend/services/ar-settings';
import Configuration from 'explorviz-frontend/services/configuration';
import LandscapeRenderer from 'explorviz-frontend/services/landscape-renderer';
import computeApplicationCommunication from 'explorviz-frontend/utils/landscape-rendering/application-communication-computer';
import * as LandscapeCommunicationRendering from 'explorviz-frontend/utils/landscape-rendering/communication-rendering';
import LandscapeLabeler from 'explorviz-frontend/utils/landscape-rendering/labeler';
import { DynamicLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/dynamic-data';
import { Application, Node, StructureLandscapeData } from 'explorviz-frontend/utils/landscape-schemes/structure-data';
import ImageLoader from 'explorviz-frontend/utils/three-image-loader';
import ApplicationMesh from 'explorviz-frontend/view-objects/3d/landscape/application-mesh';
import LandscapeObject3D from 'explorviz-frontend/view-objects/3d/landscape/landscape-object-3d';
import NodeMesh from 'explorviz-frontend/view-objects/3d/landscape/node-mesh';
import PlaneLayout from 'explorviz-frontend/view-objects/layout-models/plane-layout';
import THREE from 'three';
import VrLandscapeObject3D from '../utils/view-objects/landscape/vr-landscape-object-3d';
import VrAssetRepository from './vr-asset-repo';
import VrSceneService from './vr-scene';

// Scalar with which the landscape is scaled (evenly in all dimensions)
const LANDSCAPE_SCALAR = 0.1;

// Depth of boxes for landscape entities
const LANDSCAPE_DEPTH = 0.7;

export default class VrLandscapeRenderer extends Service {
  private debug = debugLogger('VrLandscapeRenderer');

  @service('vr-scene')
  private sceneService!: VrSceneService;

  @service('landscape-renderer')
  private landscapeRenderer!: LandscapeRenderer;

  modelIdToPlaneLayout: Map<string, PlaneLayout> | null = null;

  // Initialize landscape such that largest side meets this value
  largestSide: number | undefined;

  constructor(properties?: object) {
    super(properties);

    this.sceneService.scene.add(this.landscapeObject3D);
  }
  // #region LANDSCAPE POSITIONING
  //
  get landscapeObject3D() {
    return this.landscapeRenderer.landscapeObject3D
  }

  private resetScale() {
    this.landscapeObject3D.scale.set(
      LANDSCAPE_SCALAR,
      LANDSCAPE_SCALAR,
      LANDSCAPE_SCALAR,
    );
  }

  resetRotation() {
    this.landscapeObject3D.rotation.x = -90 * THREE.MathUtils.DEG2RAD;
    this.landscapeObject3D.rotation.y = 0;
    this.landscapeObject3D.rotation.z = 0;
  }

  private resetPosition() {
    // Compute bounding box of the floor.
    const bboxFloor = new THREE.Box3().setFromObject(this.sceneService.floor);

    // Calculate center of the floor.
    const centerFloor = new THREE.Vector3();
    bboxFloor.getCenter(centerFloor);

    const bboxLandscape = new THREE.Box3().setFromObject(
      this.landscapeObject3D,
    );

    // Calculate center of the landscape.
    const centerLandscape = new THREE.Vector3();
    bboxLandscape.getCenter(centerLandscape);

    // Set new position of landscape
    this.landscapeObject3D.position.x += centerFloor.x - centerLandscape.x;
    this.landscapeObject3D.position.z += centerFloor.z - centerLandscape.z;

    // Check distance between floor and landscape
    if (bboxLandscape.min.y > bboxFloor.max.y) {
      this.landscapeObject3D.position.y
        += bboxFloor.max.y - bboxLandscape.min.y + 0.001;
    }

    // Check if landscape is underneath the floor
    if (bboxLandscape.min.y < bboxFloor.min.y) {
      this.landscapeObject3D.position.y
        += bboxFloor.max.y - bboxLandscape.min.y + 0.001;
    }
  }

  centerLandscape() {
    this.resetRotation();

    if (this.largestSide) {
      this.landscapeObject3D.setLargestSide(this.largestSide);
    } else {
      this.resetScale();
      this.resetPosition();
    }
  }

  setLargestSide(largestSide: number) {
    this.largestSide = largestSide;
    this.landscapeObject3D.setLargestSide(largestSide);
  }

  // #endregion LANDSCAPE POSITIONING

  // #region SCENE POPULATION

  cleanUpLandscape() {
    this.landscapeObject3D.removeAllChildren();
    this.landscapeObject3D.resetMeshReferences();
  }

  // #endregion SCENE POPULATION

  resetService() {
    this.cleanUpLandscape();
    this.largestSide = undefined;
  }
}

declare module '@ember/service' {
  interface Registry {
    'vr-landscape-renderer': VrLandscapeRenderer;
  }
}
