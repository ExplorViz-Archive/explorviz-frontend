import Component from '@ember/component';
import { inject as service } from "@ember/service";

import { task } from 'ember-concurrency-decorators';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import { all } from 'rsvp';
import { action, set } from '@ember/object';
import DS from 'ember-data';
import UserSettings from 'explorviz-frontend/services/user-settings';
import Role from 'explorviz-frontend/models/role';
import User from 'explorviz-frontend/models/user';
import Setting from 'explorviz-frontend/models/setting';

type Settings = {
  [origin: string]: {
    [settingsype:string]: [[string, any]]|[]
  }
};

type Page = 'createSingleUser'|'createMultipleUsers';

type UserTrimmed = {
  id: string,
  username: string,
  password: string
}

export default class UserCreation extends Component {

  // No Ember generated container
  tagName = '';

  @service('store') store!: DS.Store;
  @service('user-settings') userSettings!: UserSettings;
  @service printThis!: any;

  createdUsers:UserTrimmed[] = [];
  showNewUsers:boolean = false;
  page:Page = 'createSingleUser';

  // {
  //   origin1: boolean1,
  //   origin2: boolean2
  //   ...
  // }
  useDefaultSettings:{
    [origin: string]: boolean
  } = {};


  /*
    {
      origin1: {
        settingstype1: [[settingId1, value1], ...]
        settingstype2: [[settingId'1, value'1], ...]
      }
      origin2: {...}
    }
  */
  settings:Settings = {};

  // single user creation input fields
  username = '';
  password = '';
  roles_selected_single:Role[] = [];

  // multiple user creation input fields
  usernameprefix = '';
  numberofusers = '';
  roles_selected_multiple:Role[] = [];

  roles:Role[] = [];

  constructor() {
    super(...arguments);

    this.initSettings.perform();
  }

  @task
  initSettings = task(function * (this:UserCreation) {
    let settingTypes = [...this.userSettings.types];
    let allSettings:Setting[] = [];
    // get all settings
    for (const type of settingTypes) {
      let settings = yield this.store.peekAll(type);
      allSettings.pushObjects(settings.toArray());
    }

    let origins:string[] = [...new Set(allSettings.mapBy('origin'))];

    let settingsByOrigin:Settings = {};

    for(let i = 0; i < origins.length; i++) {
      this.useDefaultSettings[origins[i]] = true;
      // initialize settings object for origin containing arrays for every type
      settingsByOrigin[origins[i]] = {};
      for (const type of settingTypes) {
        settingsByOrigin[origins[i]][type] = [];
      }
    }

    // copy all settings to settingsByOrigin
    // use default if no perefenrece exists for user, else use preference value
    for(let i = 0; i < allSettings.length; i++) {
      let setting = allSettings[i];
      // @ts-ignore
      settingsByOrigin[setting.origin][setting.constructor.modelName].push([setting.id, setting.defaultValue]);
    }

    set(this, 'settings', settingsByOrigin);
  });

  @action
  printNewUsers() {
    const selector = '#new-user-list';
    const options = {
      printDelay: 200
    };

    this.printThis.print(selector, options);
  }

  @action
  hideNewUsersCreatedModal() {
    set(this, 'createdUsers', []);
    set(this, 'showNewUsers', false);
  }

  @task
  saveUser = task(function * (this:UserCreation) {
    const { username, password, roles_selected_single } = this;

    // check for valid input
    if(!username || username.length === 0) {
      AlertifyHandler.showAlertifyWarning('Username cannot be empty.');
      return;
    } else if(!password || password.length === 0) {
      AlertifyHandler.showAlertifyWarning('Password cannot be empty.');
      return;
    } else if(!roles_selected_single || roles_selected_single.length === 0) {
      AlertifyHandler.showAlertifyWarning('User needs at least 1 role.');
      return;
    }

    const roles = roles_selected_single.map((role:Role) => role.id);

    const userRecord = this.store.createRecord('user', {
      username,
      password,
      roles
    });

    try {
      yield userRecord.save();
      yield createPreferences.bind(this)(userRecord.id);
      AlertifyHandler.showAlertifySuccess(`User <b>${username}</b> was created.`);
      clearInputFields.bind(this)();
    } catch(reason) {
      this.showReasonErrorAlert(reason);
      userRecord.deleteRecord();
    }

    function clearInputFields(this:UserCreation) {
      this.setProperties({
        username: '',
        password: '',
        roles_selected_single: []
      });
    }

    function createPreferences(this:UserCreation, uid:string) {
      let settingsPromiseArray = [];

      const settings = Object.entries(this.settings);

      for (const [origin, settingsObject] of settings) {
        if(this.useDefaultSettings[origin])
          continue;

        let allSettings = [...Object.values(settingsObject)].flat();
        // create records for the preferences and save them
        for(let i = 0; i < allSettings.length; i++) {
          const preferenceRecord = this.store.createRecord('userpreference', {
            userId: uid,
            settingId: allSettings[i][0],
            value: allSettings[i][1]
          });
          settingsPromiseArray.push(preferenceRecord.save());
        }
      }

      return all(settingsPromiseArray);
    }
  });

  @task
  saveMultipleUsers = task(function * (this:UserCreation) {
    const PASSWORD_LENGTH = 8;

    const { usernameprefix, numberofusers, roles_selected_multiple } = this;
    const numberOfUsers = parseInt(numberofusers);

    // check for valid input
    if(!usernameprefix || usernameprefix.length === 0) {
      AlertifyHandler.showAlertifyWarning('Username prefix cannot be empty.');
      return;
    } else if(!numberofusers || numberOfUsers <= 1) {
      AlertifyHandler.showAlertifyWarning('# of users must be at least 2.');
      return;
    } else if(!roles_selected_multiple || roles_selected_multiple.length === 0) {
      AlertifyHandler.showAlertifyWarning('Users need at least 1 role.');
      return;
    }
    
    if(numberOfUsers >= 65) {
      AlertifyHandler.showAlertifyMessageWithDuration("User creation might take some time. You will be notified when it's done.", 5, "warning");
    }

    let passwords = this.generatePasswords(numberOfUsers, PASSWORD_LENGTH);

    const roles = roles_selected_multiple.map((role:Role) => role.id);

    let preferences:{[settingId:string]: any} = {};

    // for all settings, add a preference for the new users if default settings was not chosen.
    const settings = Object.entries(this.settings)
    for (const [origin, settingsObject] of settings) {
      if(this.useDefaultSettings[origin])
        continue;

      let allSettings = [...Object.values(settingsObject)].flat();
      // create records for the preferences and save them
      for(let i = 0; i < allSettings.length; i++) {
        let settingId = allSettings[i][0];
        let value = allSettings[i][1];
        preferences[settingId] = value;
      }
    }

    const userBatchRecord = this.store.createRecord('userbatchrequest', {
      prefix: usernameprefix,
      count: numberOfUsers,
      passwords,
      roles,
      preferences
    });

    try {
      yield userBatchRecord.save();
      let users:DS.ManyArray<User> = yield userBatchRecord.users;
      AlertifyHandler.showAlertifySuccess(`All users were successfully created.`);
      clearInputFields.bind(this)();
      this.showCreatedUsers(users.toArray(), passwords);
    } catch(reason) {
      this.showReasonErrorAlert(reason);
    } finally {
      userBatchRecord.unloadRecord();
    }

    function clearInputFields(this:UserCreation) {
      this.setProperties({
        usernameprefix: '',
        numberofusers: '',
        roles_selected_multiple: []
      });
    }
  });

  generatePasswords(count:number, length:number) {
    let passwords = [];

    for(let i = 1; i <= count; i++) {
      passwords.push(this.generatePassword(length));
    }
    return passwords;
  }

  generatePassword(length:number) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for(let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  showReasonErrorAlert(reason:any) {
    const { title, detail } = reason.errors[0];
    AlertifyHandler.showAlertifyError(`<b>${title}:</b> ${detail}`);
  }

  showCreatedUsers(userList:User[], passwords:string[]) {
    let createdUsers:UserTrimmed[] = [];
    for(let i = 0; i < userList.length; i++) {
      let user = userList[i];
      if(user !== undefined) {
        let password = passwords[i];
        createdUsers.push({
          id: user.id,
          username: user.username,
          password
        });
      }
    }
    set(this, 'createdUsers', createdUsers);
    set(this, 'showNewUsers', true);
  }

  @task
  getRoles = task(function * (this:UserCreation) {
    let roles:DS.RecordArray<Role> = yield this.store.findAll('role', { reload: true });
    set(this, 'roles', roles.toArray());
  });
}
