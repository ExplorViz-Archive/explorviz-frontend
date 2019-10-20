import Component from '@ember/component';

// see verticalPosition option at
// https://ember-power-select.com/docs/api-reference
type Position = 'below'|'above'|'auto';

export default class PageSizeSelector extends Component {
  // page sizes that are displayed for selection
  pageSizes!: number[];
  // current page size
  size!: number;

  // label left to the select box
  label!: string|undefined;
  position: Position = 'auto';
};
