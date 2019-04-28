import Object from '@ember/object';
import Evented from '@ember/object/evented';
import THREE from "three";

export default Object.extend(Evented, {

  centerPoint: null,
  cameraZ: null,

  calculateLandscapeCenterAndZZoom(emberLandscape: any, renderer: THREE.WebGLRenderer) {
    // Semantics of rect entries
    const MIN_X = 0;
    const MAX_X = 1;
    const MIN_Y = 2;
    const MAX_Y = 3;

    const rect = getLandscapeRect(emberLandscape);
    const EXTRA_SPACE_IN_PERCENT = 0.02;

    let requiredWidth = Math.abs(rect.get(MAX_X) - rect.get(MIN_X));
    requiredWidth += requiredWidth * EXTRA_SPACE_IN_PERCENT;

    let requiredHeight = Math.abs(rect.get(MAX_Y) - rect.get(MIN_Y));
    requiredHeight += requiredHeight * EXTRA_SPACE_IN_PERCENT;

    let viewPortSize = new THREE.Vector2();
    renderer.getSize(viewPortSize);

    let viewportRatio = viewPortSize.width / viewPortSize.height;

    const sizeFactor = 0.65;

    const newZ_by_width = (requiredWidth / viewportRatio) * sizeFactor;
    const newZ_by_height = requiredHeight * sizeFactor;

    const center = new THREE.Vector3(rect.get(MIN_X) + ((rect.get(MAX_X) - rect.get(MIN_X)) / 2.0),
      rect.get(MIN_Y) + ((rect.get(MAX_Y) - rect.get(MIN_Y)) / 2.0), 0);

    const cameraZ = Math.max(Math.max(newZ_by_height, newZ_by_width), 10.0);

    this.set('cameraZ', cameraZ);
    this.set('centerPoint', center);

    
    // Helper functions

    function getLandscapeRect(emberLandscape: any) {
      // Semantics of rect entries
      const MIN_X = 0;
      const MAX_X = 1;
      const MIN_Y = 2;
      const MAX_Y = 3;

      let rect: number[] = [];
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
          getMinMaxFromQuad(system, rect);

          const nodegroups = system.get('nodegroups');
          nodegroups.forEach((nodegroup: any) => {
            const nodes = nodegroup.get('nodes');
            nodes.forEach((node: any) => {
              getMinMaxFromQuad(node, rect);
            });
          });
        });
      }
      return rect;
    }


    function getMinMaxFromQuad(drawnodeentity: any, rect: number[]) {
      // Semantics of rect entries
      const MIN_X = 0;
      const MAX_X = 1;
      const MIN_Y = 2;
      const MAX_Y = 3;

      const curX = drawnodeentity.get('positionX');
      const curY = drawnodeentity.get('positionY');

      if (curX < rect[MIN_X]) {
        rect[MIN_X] = curX;
      }
      if (rect[MAX_X] < curX + drawnodeentity.get('width')) {
        rect[MAX_X] = curX + drawnodeentity.get('width');
      }
      if (curY > rect[MAX_Y]) {
        rect[MAX_Y] = curY;
      }
      if (rect[MIN_Y] > curY - drawnodeentity.get('height')) {
        rect[MIN_Y] = curY - drawnodeentity.get('height');
      }
    }
  }

});
