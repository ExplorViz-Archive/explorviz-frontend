import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency';

export default Component.extend({
  
  // No Ember generated container
  tagName: '',

  store: service(),

  settings: null,

  descriptions: null,

  init() {
    this._super(...arguments);

    this.set('descriptions', {});
    
    this.get('loadDescriptions').perform('booleanAttributes');
    this.get('loadDescriptions').perform('numericAttributes');
    this.get('loadDescriptions').perform('stringAttributes');
  },

  loadDescriptions: task(function * (type) {
    yield Object.entries(this.get(`settings.${type}`)).forEach(
      ([key]) => {
        this.get('loadDescription').perform(key);
      }
    );
  }),

  loadDescription: task(function *(key){
    const descriptor = yield this.get('store').findRecord('usersetting', key);
    this.set(`descriptions.${key}`, descriptor);
  })

});
