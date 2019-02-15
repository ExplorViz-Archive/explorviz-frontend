import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({
  
  // No Ember generated container
  tagName: '',

  store: service(),

  settings: null,

  descriptions: null,

  init() {
    this._super(...arguments);

    this.initDescriptions();
  },

  initDescriptions() {
    this.set('descriptions', {});

    loadDescriptions.bind(this)('booleanAttributes');
    loadDescriptions.bind(this)('numericAttributes');
    loadDescriptions.bind(this)('stringAttributes');

    function loadDescriptions(type) {
      Object.entries(this.get(`settings.${type}`)).forEach(
        ([key]) => {
          this.get('store').findRecord('usersetting', key).then(descriptor => {
            this.set(`descriptions.${key}`, descriptor);
          });
        }
      );
    }
  }

});
