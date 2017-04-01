import Ember from 'ember';

// TODO use this as generic comparison helper
// not only for string equality

export function stringComparison(params) {
  return params[0] === params[1];
}

export default Ember.Helper.helper(stringComparison);
