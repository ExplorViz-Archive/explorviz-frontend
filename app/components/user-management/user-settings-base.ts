import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency-decorators';
import { action, set } from '@ember/object';
import DS from 'ember-data';
import UserSettings from 'explorviz-frontend/services/user-settings';

export default class UserSettingsBase extends Component {
  
  // No Ember generated container
  tagName = '';

  @service('store') store!: DS.Store;
  @service('user-settings') userSettings!: UserSettings;

  // {
  //   rangesetting: [[settingId0,value0],...,[settingIdN,valueN]],
  //   flagsetting: [[settingId0,value0],...,[settingIdN,valueN]]
  // }
  settings:{
    [type:string]: [[string, any]]
  } = {};

  descriptions:{
    [settingId:string]: {
      description: string,
      displayName: string
    }
  } = {};

  init() {
    super.init();

    set(this, 'descriptions', {});
    
    let typesArray = [...Object.keys(this.settings)].flat();

    for(let i = 0; i < typesArray.length; i++) {
      this.loadDescriptions.perform(typesArray[i]);
    }
  }

  @task
  loadDescriptions = task(function * (this:UserSettingsBase, type:string) {
    for (const [id] of this.settings[type]) {
      const { description, displayName } = yield this.store.peekRecord(type, id);
      set(this.descriptions, id, { description, displayName });
    }
  });

  @action
  onRangeSettingChange(index:number, valueNew:any) {
    this.settings.rangesetting[index].set(1, Number(valueNew));
  }
}
