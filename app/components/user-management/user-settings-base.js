import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency';

export default Component.extend({
  
  // No Ember generated container
  tagName: '',

  store: service(),

  // {
  //   rangesettings: [[settingId0,value0],...,[settingIdN,valueN]],
  //   flagsettings: [[settingId0,value0],...,[settingIdN,valueN]]
  // }
  settings: null,

  // { settingId: { description, displayName } }
  descriptions: null,

  init() {
    this._super(...arguments);

    this.set('descriptions', {});
    
    this.get('loadDescriptions').perform('rangesetting');
    this.get('loadDescriptions').perform('flagsetting');
  },

  loadDescriptions: task(function * (type) {
    for (const [id] of this.get(`settings.${type}s`)) {
      const { description, displayName } = yield this.get('store').peekRecord(type, id);
      this.set(`descriptions.${id}`, { description, displayName });
    }
  }),

  actions: {
    onRangeSettingChange(index, valueNew) {
      this.get('settings').rangesettings[index].set(1, Number(valueNew));
    }
  }

});
