import Item from './item';

export default class ImageItem extends Item {
  width: number;

  height: number;

  image: HTMLImageElement;

  constructor(id: string, image: HTMLImageElement, position: { x: number, y: number },
    width: number, height: number) {
    super(id, position);

    this.width = width;
    this.height = height;
    this.image = image;
  }

  getBoundingBox() {
    return {
      minX: this.position.x,
      maxX: this.position.x + this.width,
      minY: this.position.y,
      maxY: this.position.y + this.height,
    };
  }

  drawToCanvas(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }
}
