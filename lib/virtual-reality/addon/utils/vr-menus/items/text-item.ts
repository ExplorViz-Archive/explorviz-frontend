import Item from './item';
import * as Helper from '../../vr-helpers/multi-user-helper';

type Alignment = 'left' | 'center' | 'right';

export default class TextItem extends Item {
  text: string;

  color: string;

  fontSize: number;

  alignment: Alignment;

  constructor(text: string, id: string, color: string, position: { x: number, y: number },
    fontSize: number, alignment: Alignment = 'left') {
    super(id, position);
    this.text = text;
    this.color = color;
    this.fontSize = fontSize;
    this.alignment = alignment;
  }

  setText(text: string) {
    this.text = text;
  }

  getBoundingBox() {
    return {
      minX: this.getMinX(),
      maxX: this.getMaxX(),
      minY: this.getMinY(),
      maxY: this.getMaxY(),
    };
  }

  private getMinX() {
    const size = Helper.getTextSize(this.text, `${this.fontSize}px arial`);

    let itemX = this.position.x;

    if (this.alignment === 'center') {
      itemX -= size.width / 2;
    } else if (this.alignment === 'right') {
      itemX -= size.width;
    }

    return itemX;
  }

  private getMaxX() {
    const size = Helper.getTextSize(this.text, `${this.fontSize}px arial`);

    return this.getMinX() + size.width;
  }

  private getMinY() {
    return this.position.y;
  }

  private getMaxY() {
    const size = Helper.getTextSize(this.text, `${this.fontSize}px arial`);

    return this.position.y + size.height;
  }

  drawToCanvas(ctx: CanvasRenderingContext2D): void {
    // Draw Text
    ctx.save();
    ctx.font = `${this.fontSize}px arial`;
    ctx.fillStyle = this.color;
    ctx.textAlign = this.alignment;
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    const textSize = Helper.getTextSize(this.text, ctx.font);
    ctx.fillText(this.text, this.position.x, this.position.y + textSize.sublineHeight);
    ctx.restore();
  }
}
