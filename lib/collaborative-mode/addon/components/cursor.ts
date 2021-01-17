import Component from '@glimmer/component';

interface CursorArgs {
  cursorData: {
    x: number,
    y: number,
    color: string
  };
}

export default class Cursor extends Component<CursorArgs> {

  get left() {
    return `${this.args.cursorData.x}px`;
  }

  get top() {
    return `${this.args.cursorData.y}px`;
  }

  get color() {
    return this.args.cursorData.color || 'grey';
  }
}
