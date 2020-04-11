import THREE from 'three';
import Landscape from 'explorviz-frontend/models/landscape';
import PlaneLayout from 'explorviz-frontend/view-objects/layout-models/plane-layout';
import NodeGroup from 'explorviz-frontend/models/nodegroup';
import Node from 'explorviz-frontend/models/node';
import MinMaxRectangle from 'explorviz-frontend/view-objects/layout-models/min-max-rectangle';

export function getLandscapeRect(emberLandscape: Landscape,
  modelIdToLayout: Map<string, PlaneLayout>) {
  // Rectangle which can be used to find smallest and greatest x/y coordinates
  const rect = new MinMaxRectangle();

  const systems = emberLandscape.get('systems');

  if (systems.get('length') === 0) {
    rect.setMinValues(0, 0);
    rect.setMaxValues(1, 1);
  } else {
    systems.forEach((system: any) => {
      const systemLayout = modelIdToLayout.get(system.get('id'));
      if (systemLayout) {
        rect.setMinMaxFromLayout(systemLayout);
      }

      const nodegroups = system.get('nodegroups');
      nodegroups.forEach((nodegroup: NodeGroup) => {
        const nodes = nodegroup.get('nodes');
        nodes.forEach((node: Node) => {
          const nodeLayout = modelIdToLayout.get(node.get('id'));
          if (nodeLayout) {
            rect.setMinMaxFromLayout(nodeLayout);
          }
        });
      });
    });
  }
  return rect;
}

export function calculateLandscapeCenterAndZZoom(emberLandscape: Landscape,
  modelIdToLayout: Map<string, PlaneLayout>, renderer: THREE.WebGLRenderer) {
  // Add 2% to calculated space
  const EXTRA_SPACE_IN_PERCENT = 1.02;
  const SIZE_FACTOR = 0.65;

  const rect = getLandscapeRect(emberLandscape, modelIdToLayout);

  const requiredWidth = rect.width * EXTRA_SPACE_IN_PERCENT;
  const requiredHeight = rect.height * EXTRA_SPACE_IN_PERCENT;

  const viewPortSize = new THREE.Vector2();
  renderer.getSize(viewPortSize);

  const viewportRatio = viewPortSize.width / viewPortSize.height;

  const newZByWidth = (requiredWidth / viewportRatio) * SIZE_FACTOR;
  const newZByHeight = requiredHeight * SIZE_FACTOR;
  const cameraZ = Math.max(newZByHeight, newZByWidth, 10.0);

  const center = new THREE.Vector3(
    rect.min_x + ((rect.max_x - rect.min_x) / 2.0),
    rect.min_y + ((rect.max_y - rect.min_y) / 2.0),
    cameraZ,
  );

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
