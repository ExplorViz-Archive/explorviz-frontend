import Component from '@ember/component';
import { inject as service } from "@ember/service";

import { task } from 'ember-concurrency';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import { all } from 'rsvp';

export default Component.extend(AlertifyHandler, {

  // No Ember generated container
  tagName: '',

  store: service(),
  printThis: service(),

  createdUsers: null,
  showNewUsers: null,
  page: null,

  // object of setting arrays of form
  // [[settingId0,settingValue0],...,[settingIdN,settingValueN]]
  settings: null,

  init() {
    this._super(...arguments);
    this.set('showNewUsers', false);
    this.set('page', 'createSingleUser');

    this.get('initSettings').perform();
  },

  initSettings: task(function * () {
    let rangeSettings = yield this.get('store').peekAll('rangesetting');
    let flagSettings = yield this.get('store').peekAll('flagsetting');

    let rangeSettingsMap = new Map();
    let flagSettingsMap = new Map();

    // copy all settings with their according default values into the maps
    for(let i = 0; i < rangeSettings.get('length'); i++) {
      let setting = rangeSettings.objectAt(i);
      rangeSettingsMap.set(setting.get('id'), setting.get('defaultValue'));
    }
    for(let i = 0; i < flagSettings.get('length'); i++) {
      let setting = flagSettings.objectAt(i);
      flagSettingsMap.set(setting.get('id'), setting.get('defaultValue'));
    }

    this.set('settings', {
      rangesettings: [...rangeSettingsMap],
      flagsettings: [...flagSettingsMap]
    });
  }),

  actions: {
    printNewUsers() {
      const selector = '#new-user-list';
      const options = {
        printDelay: 200
      };
 
      this.get('printThis').print(selector, options);
    },

    hideNewUsersCreatedModal() {
      this.set('createdUsers', []);
      this.set('showNewUsers', false);
    }
  },

  saveUser: task(function * () {
    const userData = this.getProperties('username', 'password', 'roles_selected_single');

    // check for valid input
    if(!userData.username || userData.username.length === 0) {
      this.showAlertifyWarning('Username cannot be empty.');
      return;
    } else if(!userData.password || userData.password.length === 0) {
      this.showAlertifyWarning('Password cannot be empty.');
      return;
    } else if(!userData.roles_selected_single || userData.roles_selected_single.length === 0) {
      this.showAlertifyWarning('User needs at least 1 role.');
      return;
    }

    const userRecord = this.get('store').createRecord('user', {
      username: userData.username,
      password: userData.password,
      roles: userData.roles_selected_single
    });

    try {
      yield userRecord.save();
      yield createPreferences.bind(this)(userRecord.get('id'));
      this.showAlertifySuccess(`User <b>${userData.username}</b> was created.`);
      clearInputFields.bind(this)();
    } catch(reason) {
      this.showReasonErrorAlert(reason);
      userRecord.deleteRecord();
    }

    function clearInputFields() {
      this.setProperties({
        username: "",
        password: "",
        roles_selected_single: []
      });
    }

    function createPreferences(uid) {
      let settingsPromiseArray = [];
      // group all settings
      let flagSettings = this.get('settings').flagsettings;
      let rangeSettings = this.get('settings').rangesettings;
      let allSettings = [].concat(flagSettings, rangeSettings);

      // create records for the preferences and save them
      for(let i = 0; i < allSettings.length; i++) {
        const preferenceRecord = this.get('store').createRecord('userpreference', {
          userId: uid,
          settingId: allSettings[i][0],
          value: allSettings[i][1]
        });
        settingsPromiseArray.push(preferenceRecord.save());
      }

      return new all(settingsPromiseArray);
    }
  }),

  saveMultipleUsers: task(function * () {
    const PASSWORD_LENGTH = 8;

    const userData = this.getProperties('usernameprefix', 'numberofusers', 'roles_selected_multiple');
    const numberOfUsers = parseInt(userData.numberofusers);

    // check for valid input
    if(!userData.usernameprefix || userData.usernameprefix.length === 0) {
      this.showAlertifyWarning('Username prefix cannot be empty.');
      return;
    } else if(!userData.numberofusers || numberOfUsers <= 1) {
      this.showAlertifyWarning('# of users must be at least 2.');
      return;
    } else if(!userData.roles_selected_multiple || userData.roles_selected_multiple.length === 0) {
      this.showAlertifyWarning('Users need at least 1 role.');
      return;
    }
    
    if(numberOfUsers >= 65) {
      this.showAlertifyWarning("User creation might take some time. You will be notified when it's done.");
    }

    let passwords = this.generatePasswords(numberOfUsers, PASSWORD_LENGTH);

    // property in backend is called descriptor and not id
    const roles = userData.roles_selected_multiple.map(role => new Object({descriptor: role.id}));

    // group all settings
    let flagSettings = this.get('settings').flagsettings;
    let rangeSettings = this.get('settings').rangesettings;
    let allSettings = [].concat(flagSettings, rangeSettings);

    let preferences = {};

    for(let j = 0; j < allSettings.length; j++) {
      let settingId = allSettings[j][0];
      let value = allSettings[j][1];
      preferences[settingId] = value;
    }

    const userBatchRecord = this.get('store').createRecord('userbatchrequest', {
      prefix: userData.usernameprefix,
      count: numberOfUsers,
      passwords,
      roles,
      preferences
    });

    try {
      yield userBatchRecord.save();
      let users = yield userBatchRecord.get('users');
      this.showAlertifySuccess(`All users were successfully created.`);
      clearInputFields.bind(this)();
      this.showCreatedUsers(users, passwords);
    } catch(reason) {
      this.showReasonErrorAlert(reason);
    } finally {
      userBatchRecord.unloadRecord();
      this.get('store')._removeFromIdMap(userBatchRecord._internalModel);
    }

    function clearInputFields() {
      this.setProperties({
        usernameprefix: "",
        numberofusers: "",
        roles_selected_multiple: []
      });
    }
  }),

  generatePasswords(count, length) {
    let passwords = [];

    for(let i = 1; i <= count; i++) {
      passwords.push(this.generatePassword(length));
    }
    return passwords;
  },

  generatePassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for(let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  },

  showReasonErrorAlert(reason) {
    const {title, detail} = reason.errors[0];
    this.showAlertifyError(`<b>${title}:</b> ${detail}`);
  },

  showCreatedUsers(userList, passwords) {
    let createdUsers = [];
    for(let i = 0; i < userList.length; i++) {
      let user = userList.objectAt(i);
      let password = passwords[i];
      createdUsers.push({
        id: user.get('id'),
        username: user.get('username'),
        password
      });
    }
    this.set('createdUsers', createdUsers);
    this.set('showNewUsers', true);
  },

  getRoles: task(function * () {
    yield this.set('roles', this.store.findAll('role'));
  })
});
