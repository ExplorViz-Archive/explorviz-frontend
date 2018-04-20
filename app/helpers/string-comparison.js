 import { helper } from '@ember/component/helper';

// TODO use this as generic comparison helper
// not only for string equality

export function stringComparison(params) {
  return params[0] === params[1];
}

export default helper(stringComparison);
