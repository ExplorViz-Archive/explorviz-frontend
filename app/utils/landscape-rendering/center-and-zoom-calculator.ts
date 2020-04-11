import THREE from 'three';
import Landscape from 'explorviz-frontend/models/landscape';
import PlaneLayout from 'explorviz-frontend/view-objects/layout-models/plane-layout';
import NodeGroup from 'explorviz-frontend/models/nodegroup';
import Node from 'explorviz-frontend/models/node';

export function getMinMaxFromQuad(layout: PlaneLayout, rect: number[]) {
  // Semantics of rect entries
  const MIN_X = 0;
  const MAX_X = 1;
  const MIN_Y = 2;
  const MAX_Y = 3;

  const curX = layout.positionX;
  const curY = layout.positionY;

  if (curX < rect[MIN_X]) {
    rect[MIN_X] = curX;
  }
  if (rect[MAX_X] < curX + layout.width) {
    rect[MAX_X] = curX + layout.width;
  }
  if (curY > rect[MAX_Y]) {
    rect[MAX_Y] = curY;
  }
  if (rect[MIN_Y] > curY - layout.height) {
    rect[MIN_Y] = curY - layout.height;
  }
}

export function getLandscapeRect(emberLandscape: Landscape,
  modelIdToLayout: Map<string, PlaneLayout>) {
  // Semantics of rect entries
  const MIN_X = 0;
  const MAX_X = 1;
  const MIN_Y = 2;
  const MAX_Y = 3;

  const rect: number[] = [];
  rect.push(Number.MAX_VALUE);
  rect.push(-Number.MAX_VALUE);
  rect.push(Number.MAX_VALUE);
  rect.push(-Number.MAX_VALUE);

  const systems = emberLandscape.get('systems');

  if (systems.get('length') === 0) {
    rect[MIN_X] = 0.0;
    rect[MAX_X] = 1.0;
    rect[MIN_Y] = 0.0;
    rect[MAX_Y] = 1.0;
  } else {
    systems.forEach((system: any) => {
      const systemLayout = modelIdToLayout.get(system.get('id'));
      if (systemLayout) {
        getMinMaxFromQuad(systemLayout, rect);
      }

      const nodegroups = system.get('nodegroups');
      nodegroups.forEach((nodegroup: NodeGroup) => {
        const nodes = nodegroup.get('nodes');
        nodes.forEach((node: Node) => {
          const nodeLayout = modelIdToLayout.get(node.get('id'));
          if (nodeLayout) {
            getMinMaxFromQuad(nodeLayout, rect);
          }
        });
      });
    });
  }
  return rect;
}

export function calculateLandscapeCenterAndZZoom(emberLandscape: Landscape,
  modelIdToLayout: Map<string, PlaneLayout>, renderer: THREE.WebGLRenderer) {
  // Semantics of rect entries
  const MIN_X = 0;
  const MAX_X = 1;
  const MIN_Y = 2;
  const MAX_Y = 3;

  const EXTRA_SPACE_IN_PERCENT = 0.02;
  const SIZE_FACTOR = 0.65;

  const rect = getLandscapeRect(emberLandscape, modelIdToLayout);

  let requiredWidth = Math.abs(rect.get(MAX_X) - rect.get(MIN_X));
  requiredWidth += requiredWidth * EXTRA_SPACE_IN_PERCENT;

  let requiredHeight = Math.abs(rect.get(MAX_Y) - rect.get(MIN_Y));
  requiredHeight += requiredHeight * EXTRA_SPACE_IN_PERCENT;

  const viewPortSize = new THREE.Vector2();
  renderer.getSize(viewPortSize);

  const viewportRatio = viewPortSize.width / viewPortSize.height;

  const newZByWidth = (requiredWidth / viewportRatio) * SIZE_FACTOR;
  const newZByHeight = requiredHeight * SIZE_FACTOR;
  const cameraZ = Math.max(newZByHeight, newZByWidth, 10.0);

  const center = new THREE.Vector3(rect.get(MIN_X) + ((rect.get(MAX_X) - rect.get(MIN_X)) / 2.0),
    rect.get(MIN_Y) + ((rect.get(MAX_Y) - rect.get(MIN_Y)) / 2.0), cameraZ);

  return center;
}

export function getCenterAndZoom(emberLandscape: Landscape,
  modelIdToLayout: Map<string, PlaneLayout>, camera: THREE.PerspectiveCamera,
  webglrenderer: THREE.WebGLRenderer) {
  // Calculate new center and update zoom
  const center = calculateLandscapeCenterAndZZoom(emberLandscape, modelIdToLayout, webglrenderer);

  const INITIAL_CAM_ZOOM = 0;
  // Update zoom if camera has not been moved by user
  if (camera.position.z === INITIAL_CAM_ZOOM) {
    camera.position.z = center.z;
    camera.updateProjectionMatrix();
  }

  return center;
}
