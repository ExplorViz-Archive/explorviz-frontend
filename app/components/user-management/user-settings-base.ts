import Component from '@glimmer/component';
import { inject as service } from "@ember/service";
import { task } from 'ember-concurrency-decorators';
import { action, set } from '@ember/object';
import DS from 'ember-data';
import UserSettings from 'explorviz-frontend/services/user-settings';

interface Args {
  // {
  //   rangesetting: [[settingId0,value0],...,[settingIdN,valueN]],
  //   flagsetting: [[settingId0,value0],...,[settingIdN,valueN]]
  // }
  settings:{
    [type:string]: [[string, any]]
  },
}
export default class UserSettingsBase extends Component<Args> {

  @service('store') store!: DS.Store;
  @service('user-settings') userSettings!: UserSettings;

  descriptions:{
    [settingId:string]: {
      description: string,
      displayName: string
    }
  } = {};

  constructor(owner: any, args: Args) {
    super(owner, args);

    this.descriptions = {};
    
    let typesArray = [...Object.keys(this.args.settings)].flat();

    for(let i = 0; i < typesArray.length; i++) {
      this.loadDescriptions.perform(typesArray[i]);
    }
  }

  @task
  loadDescriptions = task(function * (this:UserSettingsBase, type:string) {
    for (const [id] of this.args.settings[type]) {
      const { description, displayName } = yield this.store.peekRecord(type, id);
      set(this.descriptions, id, { description, displayName });
    }
  });

  @action
  onRangeSettingChange(index:number, valueNew:any) {
    this.args.settings.rangesetting[index].set(1, Number(valueNew));
  }
}
