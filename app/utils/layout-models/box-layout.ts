import Component from "explorviz-frontend/models/component";
import Clazz from "explorviz-frontend/models/clazz";

export default class BoxLayout {

  model: Component | Clazz;
  height: number = 1;
  width: number = 1;
  depth: number = 1;
  positionX: number = 0;
  positionY: number = 0;
  positionZ: number = 0;

  constructor(model: Component | Clazz) {
    this.model = model;
  }

}