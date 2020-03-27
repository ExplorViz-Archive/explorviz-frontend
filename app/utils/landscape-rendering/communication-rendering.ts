import THREE from 'three';
import AppCommunication from 'explorviz-frontend/models/applicationcommunication';
import DS from 'ember-data';
// @ts-ignore
import { MeshLine, MeshLineMaterial } from 'threejs-meshline'

type point = { x: number, y: number };

// Model for a drawable application communication
type tile = {
  startPoint: point, endPoint: point, positionZ: number, requestsCache: number,
  lineThickness: number, pipeColor: THREE.Color, emberModel: AppCommunication
}

// Simplified Tile
type tileWay = { startPoint: point, endPoint: point };


/**
 * Aggregate points and request cache numbers of application communication 
 * to get communication tiles. Those can later on be used to determine the 
 * corresponding line thickness for the visualization.
 * 
 * @param appCommunications Array of all application communications
 * @param color Desired color for the tiles
 */
export function computeCommunicationTiles(appCommunications: DS.PromiseManyArray<AppCommunication>, modelIdToPoints: Map<string, point[]>, color: string) {
  let tiles: tile[] = [];
  let tile: tile;

  appCommunications.forEach((applicationCommunication: AppCommunication) => {

    const points = modelIdToPoints.get(applicationCommunication.get('id'));
  

    if (points && points.length > 0) {

      for (let i = 1; i < points.length; i++) {

        const lastPoint = points[i - 1];
        const thisPoint = points[i];

        // Simpliefied tile to check for equality of tiles
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
            positionZ: 0.0025, // Tiles should be in front of systems
            requestsCache: 0,
            lineThickness: 0,
            pipeColor: new THREE.Color(color),
            emberModel: applicationCommunication
          };
          tiles.push(tile);
        }

        tile.requestsCache = tile.requestsCache +
          applicationCommunication.get('requests');
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
export function isSameTile(this: tileWay, tile: any) {
  return checkEqualityOfPoints(this.endPoint, tile.endPoint) &&
    checkEqualityOfPoints(this.startPoint, tile.startPoint);
}


export function checkEqualityOfPoints(p1: point, p2: point) {
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
 * 
 * @param requestMap Maps number of requests to a numerical category
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
 * @param requestMap Maps number of requests to a numerical category
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


export function addCommunicationLineDrawing(tiles: tile[], parent: THREE.Object3D, centerPoint: point) {
  const requestsToCategory = new Map();

  // Initialize Category mapping with default value 0
  tiles.forEach((tile) => {
    requestsToCategory.set(tile.requestsCache, 0);
  });

  const categoryMapping = getCategories(requestsToCategory, true);

  if (!categoryMapping && categoryMapping === undefined) return;

  for (let i = 0; i < tiles.length; i++) {
    let tile = tiles[i];
    let category = categoryMapping.get(tile.requestsCache);
    if (category) {
      tile.lineThickness = 0.7 * category + 0.1;
      createLine(tile, parent, centerPoint);
    }
  }
}

/**
 * Draws a line according to the given parameters.
 * 
 * @param tile Tile containing data for drawing the line
 * @param parent Object to which the line shall be added
 * @param centerPoint Offset for drawing
 */
export function createLine(tile: tile, parent: THREE.Object3D, centerPoint: point) {
  let firstVector = new THREE.Vector3(tile.startPoint.x - centerPoint.x,
    tile.startPoint.y - centerPoint.y, tile.positionZ);
  let secondVector = new THREE.Vector3(tile.endPoint.x - centerPoint.x,
    tile.endPoint.y - centerPoint.y, tile.positionZ);

  let points = [firstVector, secondVector];

  // We cannot use default lines here since they do not
  // support different line thicknesses
  const geometry = new MeshLine();
  geometry.setVertices(points, () => tile.lineThickness * 0.4);

  const material = new MeshLineMaterial({
    color: tile.pipeColor,
  });

  const line = new THREE.Mesh(geometry, material)

  parent.add(line);
}