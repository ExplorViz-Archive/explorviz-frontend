import Component from '@ember/component';

export default Component.extend({
  
  // No Ember generated container
  tagName: '',

  booleans: null,
  numerics: null,
  strings: null,

  descriptions: null,

  init() {
    this._super(...arguments);
    // TODO: load descriptions here
  }

});
