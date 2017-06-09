import Ember from 'ember';

export default Ember.Component.extend({

  configuration: Ember.inject.service("configuration"),

  // @Override
  didRender() {
    this._super(...arguments);
    this.initColorpicker();
  },


  // @Override
  willDestroyElement() {
    this._super(...arguments);
  
    this.$('#cp1').colorpicker().off('changeColor');
    this.$('#cp2').colorpicker().off('changeColor');
    this.$('#cp3').colorpicker().off('changeColor');
    this.$('#cp4').colorpicker().off('changeColor');
    this.$('#cp5').colorpicker().off('changeColor');
    this.$('#cp6').colorpicker().off('changeColor');
  },


  initColorpicker() {

    const self = this;

    this.$('#cp1').colorpicker();
    this.$('#cp2').colorpicker();
    this.$('#cp3').colorpicker();
    this.$('#cp4').colorpicker();
    this.$('#cp5').colorpicker();
    this.$('#cp6').colorpicker();

    // Setup Handlers
    this.$('#cp1').colorpicker().on('changeColor', function(event){
      self.set('configuration.landscapeColors.system', event.value);
    });

    this.$('#cp2').colorpicker().on('changeColor', function(event){
      self.set('configuration.landscapeColors.nodegroup', event.value);
    });

    this.$('#cp3').colorpicker().on('changeColor', function(event){
      self.set('configuration.landscapeColors.node', event.value);
    });

    this.$('#cp4').colorpicker().on('changeColor', function(event){
      self.set('configuration.landscapeColors.application1', event.value);
      self.set('configuration.landscapeColors.appTextureChanged', true);
    });

    this.$('#cp5').colorpicker().on('changeColor', function(event){
      self.set('configuration.landscapeColors.application2', event.value);
      self.set('configuration.landscapeColors.appTextureChanged', true);
    });

    this.$('#cp6').colorpicker().on('changeColor', function(event){
      self.set('configuration.landscapeColors.communication', event.value);
    });

    
  }


});
