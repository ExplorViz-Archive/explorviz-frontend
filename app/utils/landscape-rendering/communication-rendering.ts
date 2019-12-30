import THREE from 'three';
import AppCommunication from 'explorviz-frontend/models/applicationcommunication';
import DS from 'ember-data';

type Point = { x: number, y: number };

// Model for a drawable application communication
type Tile = {
  startPoint: Point, endPoint: Point, positionZ: number, requestsCache: number,
  lineThickness: number, pipeColor: THREE.Color, emberModel: AppCommunication
}

// Simplified Tile
type TileWay = { startPoint: Point, endPoint: Point };


export function computeCommunicationTiles(appCommunications: DS.PromiseManyArray<AppCommunication>, color: string) {
  let tiles: Tile[] = [];
  let tile: Tile;

  appCommunications.forEach((applicationCommunication: AppCommunication) => {

    const points = applicationCommunication.get('points');

    if (points.length > 0) {

      for (var i = 1; i < points.length; i++) {

        const lastPoint = points[i - 1];
        const thisPoint = points[i];

        let tileWay = {
          startPoint: lastPoint,
          endPoint: thisPoint
        };

        let id = tiles.findIndex(isSameTile, tileWay);


        if (id !== -1) {
          tile = tiles[id];
        }
        else {
          id = tiles.length; // Gets a new index

          tile = {
            startPoint: lastPoint,
            endPoint: thisPoint,
            positionZ: 0.0025,
            requestsCache: 0,
            lineThickness: 0,
            pipeColor: new THREE.Color(color),
            emberModel: applicationCommunication
          };
          tiles.push(tile);
        }

        tile.requestsCache = tile.requestsCache +
          applicationCommunication.get('requests');

        tiles[id] = tile;
      }

    }

  });

  return tiles;
}


/**
 * Checks whether two given tiles (models for application communication)
 * are equal based on their start and end points
 * 
 * @param this First Tile for comparison check
 * @param tile Second Tile for comparison check
 */
export function isSameTile(this: TileWay, tile: any) {
  return checkEqualityOfPoints(this.endPoint, tile.endPoint) &&
    checkEqualityOfPoints(this.startPoint, tile.startPoint);
}


export function checkEqualityOfPoints(p1: Point, p2: Point) {
  let x = Math.abs(p1.x - p2.x) <= 0.01;
  let y = Math.abs(p1.y - p2.y) <= 0.01;

  return (x && y);
}


/**
 * Maps number of requests in a map with a specified method to numerical classes
 * 
 * @param requestMap Maps number of requests to a numerical category
 * @param isLinear Whether to use linear (continious) or threshold based categories
 */
export function getCategories(requestMap: Map<number, number>, isLinear: boolean) {

  if (isLinear) {
    linearCategorization(requestMap);
  }
  else {
    categorizeByThreshold(requestMap);
  }

  return requestMap;
}


/**
 * Maps number of requests to a numerical category
 */
export function categorizeByThreshold(requestMap: Map<number, number>) {
  let maxRequests = 1;

  for (let requests of requestMap.keys()) {
    maxRequests = (requests > maxRequests) ? requests : maxRequests;
  }

  const lowerThreshold = maxRequests * (1 / 3);
  const upperThreshold = maxRequests * (2 / 3);

  for (let requests of requestMap.keys()) {
    let category = getCategoryFromValue(requests, lowerThreshold, upperThreshold);
    requestMap.set(requests, category);
  }
}


/**
 * Maps a given value (# of requests) to a numerical category
 * 
 * @param requests Value which should be classified
 * @param lowerThreshold Value which is used to define categories
 * @param upperThreshold Value which is used to define categories
 */
export function getCategoryFromValue(requests: number, lowerThreshold: number, upperThreshold: number) {
  if (requests === 0) {
    return 0.0;
  } else if (requests === 1) {
    return 1.0;
  } else if (requests <= lowerThreshold) {
    return 2.0;
  } else if (requests <= upperThreshold) {
    return 3.0;
  } else {
    return 4.0;
  }
}


/**
 * Scales all entries of a given liste linearly such that 
 * the biggest item is set to 1.
 * 
 * @param list Contains # of  requests as strings
 */
export function linearCategorization(requestMap: Map<number, number>) {
  let maxRequests = 1;

  for (let requests of requestMap.keys()) {
    maxRequests = (requests > maxRequests) ? requests : maxRequests;
  }

  for (let requests of requestMap.keys()) {
    let category = requests / maxRequests;
    requestMap.set(requests, category);
  }
}


export function addCommunicationLineDrawing(tiles: Tile[], parent: THREE.Object3D, centerPoint: Point) {
  const requestsToCategory =  new Map();

  // Initialize Category mapping with default value 0
  tiles.forEach((tile) => {
    requestsToCategory.set(tile.requestsCache, 0);
  });

  const categoryMapping = getCategories(requestsToCategory, true);

  if(!categoryMapping && categoryMapping === undefined) return;

  for (let i = 0; i < tiles.length; i++) {
    let tile = tiles[i];
    let category = categoryMapping.get(tile.requestsCache);
    if (category){
      tile.lineThickness = 0.7 * category + 0.1;
      createLine(tile, parent, centerPoint);
    }
  }
}


export function createLine(tile: Tile, parent: THREE.Object3D, centerPoint: Point) {
  let firstVector = new THREE.Vector3(tile.startPoint.x - centerPoint.x,
    tile.startPoint.y - centerPoint.y, tile.positionZ);
  let secondVector = new THREE.Vector3(tile.endPoint.x - centerPoint.x,
    tile.endPoint.y - centerPoint.y, tile.positionZ);

  // New line approach (draw planes)

  // Euclidean distance
  const lengthPlane = Math.sqrt(
    Math.pow((firstVector.x - secondVector.x), 2) +
    Math.pow((firstVector.y - secondVector.y), 2));

  const geometryPlane = new THREE.PlaneGeometry(lengthPlane,
    tile.lineThickness * 0.4);

  const materialPlane = new THREE.MeshBasicMaterial({ color: tile.pipeColor });
  const plane = new THREE.Mesh(geometryPlane, materialPlane);

  let isDiagonalPlane = false;
  const diagonalPos = new THREE.Vector3();

  // Rotate plane => diagonal plane (diagonal commu line)
  if (Math.abs(firstVector.y - secondVector.y) > 0.1) {
    isDiagonalPlane = true;

    const distanceVector = new THREE.Vector3()
      .subVectors(secondVector, firstVector);

    plane.rotateZ(Math.atan2(distanceVector.y, distanceVector.x));

    diagonalPos.copy(distanceVector).multiplyScalar(0.5).add(firstVector);
  }

  // Set plane position
  if (!isDiagonalPlane) {
    const posX = firstVector.x + (lengthPlane / 2);
    const posY = firstVector.y;
    const posZ = firstVector.z;

    plane.position.set(posX, posY, posZ);
  }
  else {
    plane.position.copy(diagonalPos);
  }

  plane.userData['model'] = tile.emberModel;

  parent.add(plane);
}