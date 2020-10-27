import THREE from 'three';
// @ts-ignore: Typescript does not recognize meshline package
import { MeshLine, MeshLineMaterial } from 'threejs-meshline';
import BaseMesh from '../base-mesh';

// Simple 2-dimensional point
type Point = { x: number, y: number };

// Blueprint for application communication
type Tile = {
  startPoint: Point, endPoint: Point, positionZ: number, requestsCache: number,
  lineThickness: number, pipeColor: THREE.Color
};

export default class AppCommunicationMesh extends BaseMesh {
  dataModel: Tile;

  material: MeshLineMaterial;

  constructor(tile: Tile, highlightingColor = new THREE.Color('red')) {
    super(tile.pipeColor, highlightingColor);

    this.dataModel = tile;

    const firstVector = new THREE.Vector3(
      tile.startPoint.x,
      tile.startPoint.y,
      tile.positionZ,
    );

    const secondVector = new THREE.Vector3(
      tile.endPoint.x,
      tile.endPoint.y,
      tile.positionZ,
    );

    const points = [firstVector, secondVector];
    const geometry = new MeshLine();
    geometry.setVertices(points, () => tile.lineThickness);
    this.geometry = geometry;

    this.material = new MeshLineMaterial({
      color: tile.pipeColor,
    });
  }

  updateColor() {
    if (this.material instanceof MeshLineMaterial) {
      this.material.color = this.defaultColor;
    }
  }

  addOffset(centerPoint: THREE.Vector2) {
    this.position.x -= centerPoint.x;
    this.position.y -= centerPoint.y;
  }
}
