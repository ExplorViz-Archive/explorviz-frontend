import Ember from 'ember';

export default Ember.Component.extend({

  // @Override
  didRender() {
    this._super(...arguments);
    this.initColorpicker();
  },


  initColorpicker() {
    this.$('#cp1').colorpicker();
    this.$('#cp2').colorpicker();
    this.$('#cp3').colorpicker();
    this.$('#cp4').colorpicker();
    this.$('#cp5').colorpicker();
  }


});
