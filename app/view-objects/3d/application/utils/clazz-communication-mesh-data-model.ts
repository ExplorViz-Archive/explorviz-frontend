import { DrawableClassCommunication } from 'explorviz-frontend/utils/application-rendering/class-communication-computer';

// TODO might need to refactor as simple type

export default class ClazzCommuMeshDataModel {
  drawableClassCommus: DrawableClassCommunication[];

  bidirectional: boolean;

  id: string;

  constructor(drawableClassCommus: DrawableClassCommunication[],
    bidirectional: boolean, id: string) {
    this.drawableClassCommus = drawableClassCommus;
    this.bidirectional = bidirectional;

    this.id = id;
  }
}
