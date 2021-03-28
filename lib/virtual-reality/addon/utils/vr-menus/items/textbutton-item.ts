import InteractiveItem from './interactive-item';
import * as Helper from '../../vr-helpers/multi-user-helper';

export default class TextbuttonItem extends InteractiveItem {
  text: string;

  width: number;

  height: number;

  textSize: number;

  buttonColor: string;

  textColor: string;

  hoverColor: string;

  constructor(id: string, text: string, position: { x: number, y: number },
    width: number, height: number, textSize: number,
    buttonColor: string, textColor: string, hoverColor: string) {
    super(id, position);

    this.text = text;
    this.width = width;
    this.height = height;
    this.textSize = textSize;
    this.buttonColor = buttonColor;
    this.textColor = textColor;
    this.hoverColor = hoverColor;
  }

  drawToCanvas(ctx: CanvasRenderingContext2D): void {
    // draw button background
    ctx.fillStyle = this.isHovered ? this.hoverColor : this.buttonColor;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    // draw button text
    ctx.save();
    ctx.fillStyle = this.textColor;
    ctx.font = `${this.textSize}px arial`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    const textSize = Helper.getTextSize(this.text, ctx.font);
    ctx.fillText(this.text, this.position.x + (this.width / 2),
      this.position.y + ((this.height + textSize.sublineHeight) / 2));
    ctx.restore();
  }

  getBoundingBox(): { minX: number; maxX: number; minY: number; maxY: number; } {
    return {
      minX: this.position.x,
      maxX: this.position.x + this.width,
      minY: this.position.y,
      maxY: this.position.y + this.height,
    };
  }
}
