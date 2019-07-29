import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency';

export default Component.extend({
  
  // No Ember generated container
  tagName: '',

  store: service(),
  userSettings: service(),

  // {
  //   rangesetting: [[settingId0,value0],...,[settingIdN,valueN]],
  //   flagsetting: [[settingId0,value0],...,[settingIdN,valueN]]
  // }
  settings: null,

  // { settingId: { description, displayName } }
  descriptions: null,

  init() {
    this._super(...arguments);

    this.set('descriptions', {});
    
    let typesArray = [].concat(...Object.keys(this.get('settings')));

    for(let i = 0; i < typesArray.length; i++) {
      this.get('loadDescriptions').perform(typesArray[i]);
    }
  },

  loadDescriptions: task(function * (type) {
    for (const [id] of this.get(`settings.${type}`)) {
      const { description, displayName } = yield this.get('store').peekRecord(type, id);
      this.set(`descriptions.${id}`, { description, displayName });
    }
  }),

  actions: {
    onRangeSettingChange(index, valueNew) {
      this.get('settings').rangesetting[index].set(1, Number(valueNew));
    }
  }

});
