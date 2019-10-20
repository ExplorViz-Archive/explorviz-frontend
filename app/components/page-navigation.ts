import Component from '@ember/component';

export default class PageNavigation extends Component {
  first!: number|undefined;
  prev!: number|undefined;
  self !: number|undefined;
  next !: number|undefined;
  last !: number|undefined;

  route !: string;
};
