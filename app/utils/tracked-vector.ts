import { tracked } from "@glimmer/tracking";

export default class TrackedVector {
    @tracked x: number;
    @tracked y: number;
    @tracked z: number;
  
    constructor(x:number, y:number, z:number) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }