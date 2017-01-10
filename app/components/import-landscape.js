import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['viz'],

  threeRenderer: Ember.inject.service('threejs-renderer'),

  didRender() {
    this._super(...arguments);

    const height = this.$()[0].clientHeight;
    const width = this.$()[0].clientWidth;
    const canvas = this.$('#threeCanvas')[0];

    this.get('threeRenderer').updateWindowSize(width, height, canvas);

    this.get('threeRenderer').createLandscape(this.get('landscape'));
  }

});