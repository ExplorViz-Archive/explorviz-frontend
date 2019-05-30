import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency';

export default Component.extend({
  
  // No Ember generated container
  tagName: '',

  store: service(),

  // {
  //   rangeSettings: [[settingId0,value0],...,[settingIdN,valueN]],
  //   flagSettings: [[settingId0,value0],...,[settingIdN,valueN]]
  // }
  settings: null,

  // { settingId: { description, displayName } }
  descriptions: null,

  init() {
    this._super(...arguments);

    this.set('descriptions', {});
    
    this.get('loadDescriptions').perform('rangeSettings');
    this.get('loadDescriptions').perform('flagSettings');
  },

  loadDescriptions: task(function * (type) {
    for (const [id] of this.get(`settings.${type}`)) {
      const { description, displayName } = yield this.get('store').findRecord('settingsinfo', id);
      this.set(`descriptions.${id}`, { description, displayName });
    }
  }),

  actions: {
    onRangeSettingChange(index, valueNew) {
      this.get('settings').rangeSettings[index].set(1, Number(valueNew));
    }
  }

});
