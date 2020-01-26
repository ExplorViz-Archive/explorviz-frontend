import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import UserSettings from 'explorviz-frontend/services/user-settings';

interface IArgs {
  // {
  //   rangesetting: [[settingId0,value0],...,[settingIdN,valueN]],
  //   flagsetting: [[settingId0,value0],...,[settingIdN,valueN]]
  // }
  settings: {
    [type: string]: [[string, any]],
  };
}
export default class UserSettingsBase extends Component<IArgs> {
  @service('store') store!: DS.Store;
  @service('user-settings') userSettings!: UserSettings;

  descriptions: {
    [settingId: string]: {
      description: string,
      displayName: string,
    },
  } = {};

  @task
  loadDescriptions = task(function *(this: UserSettingsBase, type: string) {
    for (const [id] of this.args.settings[type]) {
      const { description, displayName } = yield this.store.peekRecord(type, id);
      set(this.descriptions, id, { description, displayName });
    }
  });

  constructor(owner: any, args: IArgs) {
    super(owner, args);

    this.descriptions = {};

    const typesArray = [...Object.keys(this.args.settings)].flat();

    for (const type of typesArray) {
      this.loadDescriptions.perform(type);
    }
  }

  @action
  onRangeSettingChange(index: number, valueNew: any) {
    this.args.settings.rangesetting[index].set(1, Number(valueNew));
  }

  @action
  onFlagSettingChange(index: number, valueNew: boolean) {
    this.args.settings.flagsetting[index].set(1, valueNew);
  }
}
