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
  updateSetting(origin: string, type: string, index: number, value: any): void;
  origin: string;
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
  // eslint-disable-next-line
  loadDescriptions = task(function *(this: UserSettingsBase, type: string) {
    this.args.settings[type].forEach(([id]) => {
      const { description, displayName } = this.store.peekRecord(type, id);
      set(this.descriptions, id, { description, displayName });
    });
  });

  constructor(owner: any, args: IArgs) {
    super(owner, args);

    this.descriptions = {};

    const typesArray = [...Object.keys(this.args.settings)].flat();

    typesArray.forEach((type) => {
      this.loadDescriptions.perform(type);
    });
  }

  @action
  onRangeSettingChange(index: number, valueNew: any) {
    this.args.updateSetting(this.args.origin, 'rangesetting', index, Number(valueNew));
  }

  @action
  onFlagSettingChange(index: number, valueNew: boolean) {
    this.args.updateSetting(this.args.origin, 'flagsetting', index, valueNew);
  }
}
