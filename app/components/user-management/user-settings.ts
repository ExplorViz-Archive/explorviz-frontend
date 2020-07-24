import { action, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Setting from 'explorviz-frontend/models/setting';
import User from 'explorviz-frontend/models/user';
import UserSettings from 'explorviz-frontend/services/user-settings';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import RSVP, { all } from 'rsvp';
import Userpreference from 'explorviz-frontend/models/userpreference';

interface ISettings {
  [origin: string]: {
    [settingsype: string]: [[string, any]]|[],
  };
}

interface IArgs {
  user: User|null;
}

export default class UserManagementUserSettings extends Component<IArgs> {
  @service('store') store!: DS.Store;

  @service('session') session!: any;

  @service('user-settings') userSettings!: UserSettings;

  /*
    {
      origin1: {
        settingstype1: [[settingId1, value1], ...]
        settingstype2: [[settingId'1, value'1], ...]
      }
      origin2: {...}
    }
  */
  @tracked
  settings: ISettings = {};

  /*
    {
      origin1: boolean1,
      origin2: boolean2
      ...
    }
  */
  @tracked
  useDefaultSettings: {[origin: string]: boolean} = {};

  @task
  // eslint-disable-next-line
  initSettings = task(function* (this: UserManagementUserSettings) {
    if (this.args.user === null) {
      return;
    }
    // load all settings from store
    const settingTypes = [...this.userSettings.types];
    const allSettings: Setting[] = [];
    settingTypes.forEach((type) => {
      const settings = this.store.peekAll(type);
      allSettings.pushObjects(settings.toArray());
    });

    const origins = [...new Set(allSettings.mapBy('origin'))];
    const preferences = yield this.store.query('userpreference', { userId: this.args.user.id });

    // stores settings by origin and type
    const settingsByOrigin: ISettings = {};

    origins.forEach((origin) => {
      this.useDefaultSettings[origin] = true;
      const settingsWithOrigin = allSettings.filterBy('origin', origin);

      // use default settings for settings of origin if there are no user preferences for it
      for (let j = 0; j < preferences.get('length'); j++) {
        if (settingsWithOrigin.filterBy('id', preferences.objectAt(j).get('settingId')).length > 0) {
          this.useDefaultSettings[origin] = false;
          break;
        }
      }

      // initialize settings object for origin containing arrays for every type
      settingsByOrigin[origin] = {};
      settingTypes.forEach((type) => {
        settingsByOrigin[origin][type] = [];
      });
    });

    // copy all settings to settingsByOrigin
    // use default if no perefenrece exists for user, else use preference value
    allSettings.forEach((setting) => {
      const preference = preferences.findBy('settingId', setting.get('id'));
      let value;
      if (preference !== undefined) {
        value = preference.get('value');
      } else {
        value = setting.get('defaultValue');
      }

      // @ts-ignore
      settingsByOrigin[setting.origin][setting.constructor.modelName].push([setting.id, value]);
    });

    this.settings = settingsByOrigin;
  });

  @task({ drop: true })
  // eslint-disable-next-line
  saveSettings = task(function* (this: UserManagementUserSettings) {
    if (this.args.user === null) {
      return;
    }
    const userId = this.args.user.id;

    const settings = Object.entries(this.settings);

    const settingsPromiseArray: RSVP.Promise<Userpreference>[] = [];

    settings.forEach(([origin, settingsGroupedByType]) => {
      const allSettings = [...Object.values(settingsGroupedByType)].flat();

      // patch, create or delete preference based on whether the default button for
      // the corresponding origin is enabled or not and whether or not a prefenrece already exists
      allSettings.forEach(([settingId, preferenceValueNew]) => {
        const oldRecord = this.userSettings.getUserPreference(userId, settingId);

        if (oldRecord) {
          // delete preference if user wants default settings
          if (this.useDefaultSettings[origin]) {
            settingsPromiseArray.push(oldRecord.destroyRecord());
          } else { // edit preference if user does not want default settings
            set(oldRecord, 'value', preferenceValueNew);
            settingsPromiseArray.push(oldRecord.save());
          }
        } else if (!this.useDefaultSettings[origin]) {
          // create preference if user used default settings before
          const preferenceRecord = this.store.createRecord('userpreference', {
            settingId,
            userId,
            value: preferenceValueNew,
          });
          settingsPromiseArray.push(preferenceRecord.save());
        }
      });
    });

    // wait for all records to be saved. Give out error if one fails
    yield all(settingsPromiseArray).then(() => {
      AlertifyHandler.showAlertifySuccess('Settings saved.');
    }).catch((reason) => {
      const { title, detail } = reason.errors[0];
      AlertifyHandler.showAlertifyError(`<b>${title}:</b> ${detail}`);
    });
  });

  constructor(owner: any, args: IArgs) {
    super(owner, args);

    this.initSettings.perform();
  }

  @action
  toggleDefaultSetting(origin: string) {
    this.useDefaultSettings = {
      ...this.useDefaultSettings,
      [origin]: !this.useDefaultSettings[origin],
    };
  }

  @action
  updateSetting(origin: string, type: string, index: number, value: any) {
    this.settings[origin][type][index][1] = value;

    // copy settings, so update is recognized -> reassignment of field needed
    this.settings = { ...this.settings };
  }
}
