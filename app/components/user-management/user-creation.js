import Component from '@ember/component';
import { inject as service } from "@ember/service";

import { task } from 'ember-concurrency';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import { all, allSettled } from 'rsvp';

export default Component.extend(AlertifyHandler, {

  // No Ember generated container
  tagName: '',

  store: service(),
  printThis: service(),

  showSpinner: null,

  createdUsers: null,
  showNewUsers: null,
  page: null,

  // object of setting arrays of form
  // [[settingId0,settingValue0],...,[settingIdN,settingValueN]]
  settings: null,

  didInsertElement() {
    this._super(...arguments);
    this.set('showNewUsers', false);
    this.set('page', 'createSingleUser');

    this.get('initSettings').perform();
  },

  initSettings: task(function * () {
    yield this.get('store').findAll('settingsinfo', {reload: true});

    let rangeSettings = this.get('store').peekAll('rangesetting');
    let flagSettings = this.get('store').peekAll('flagsetting');

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
      rangeSettings: [...rangeSettingsMap],
      flagSettings: [...flagSettingsMap]
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
    },

    saveUser() {
      this.set('showSpinner', true);
      const userData = this.getProperties('username', 'password', 'roles_selected_single');

      // check for valid input
      if(!userData.username || userData.username.length === 0) {
        this.set('showSpinner', false);
        this.showAlertifyWarning('Username cannot be empty.');
        return;
      } else if(!userData.password || userData.password.length === 0) {
        this.set('showSpinner', false);
        this.showAlertifyWarning('Password cannot be empty.');
        return;
      } else if(!userData.roles_selected_single || userData.roles_selected_single.length === 0) {
        this.set('showSpinner', false);
        this.showAlertifyWarning('User needs at least 1 role.');
        return;
      }

      const userRecord = this.get('store').createRecord('user', {
        username: userData.username,
        password: userData.password,
        roles: userData.roles_selected_single
      });

      userRecord.save().then(() => { // success
        createPreferences.bind(this)(userRecord.get('id'));
      }, (reason) => { // failure
        this.set('showSpinner', false);
        this.showReasonErrorAlert(reason);
        userRecord.deleteRecord();
      });

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
        let flagSettings = this.get('settings').flagSettings;
        let rangeSettings = this.get('settings').rangeSettings;
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

        // if all settings are created successfully, notify user
        // else delete the user and notify user about failure
        return new all(settingsPromiseArray).then(()=>{
          this.set('showSpinner', false);
          const message = "User <b>" + userData.username + "</b> was created.";
          this.showAlertifySuccess(message);
          clearInputFields.bind(this)();
        }).catch((reason)=>{
          this.set('showSpinner', false);
          this.showReasonErrorAlert(reason);
          userRecord.destroyRecord();
        })
      }
    },

    saveMultipleUsers() {
      this.set('showSpinner', true);
      const PASSWORD_LENGTH = 8;

      const userData = this.getProperties('usernameprefix', 'numberofusers', 'roles_selected_multiple');
      const numberOfUsers = parseInt(userData.numberofusers);

      // check for valid input
      if(!userData.usernameprefix || userData.usernameprefix.length === 0) {
        this.set('showSpinner', false);
        this.showAlertifyWarning('Username prefix cannot be empty.');
        return;
      } else if(!userData.numberofusers || numberOfUsers <= 1) {
        this.set('showSpinner', false);
        this.showAlertifyWarning('# of users must be at least 2.');
        return;
      } else if(!userData.roles_selected_multiple || userData.roles_selected_multiple.length === 0) {
        this.set('showSpinner', false);
        this.showAlertifyWarning('Users need at least 1 role.');
        return;
      }

      let userRecordArray = [];
      let userPromiseArray = [];

      for(let i = 1; i <= numberOfUsers; i++) {
        const username = `${userData.usernameprefix}_${i}`;
        const password = this.generatePassword(PASSWORD_LENGTH);
        const userRecord = this.get('store').createRecord('user', {
          username,
          password,
          roles: userData.roles_selected_multiple
        });
        userRecordArray.push(userRecord);
        userPromiseArray.push(userRecord.save());
      }

      new allSettled(userPromiseArray).then((array)=>{
        let failed;
        for(let i = 0; i < array.length; i++) {
          let { state } = array[i];
          if(state === 'rejected') {
            failed = array[i];
          }
        }

        if(failed !== undefined) {
          let { reason } = failed;
          this.set('showSpinner', false);
          this.showReasonErrorAlert(reason);
          for(let i = 0; i < numberOfUsers; i++) {
            let user = userRecordArray[i];
            user.destroyRecord();
          }
        } else {
          createPreferences.bind(this)();
        }
      });

      function clearInputFields() {
        this.setProperties({
          usernameprefix: "",
          numberofusers: "",
          roles_selected_multiple: []
        });
      }

      function createPreferences() {
        let settingsPromiseArray = [];
        // group all settings
        let flagSettings = this.get('settings').flagSettings;
        let rangeSettings = this.get('settings').rangeSettings;
        let allSettings = [].concat(flagSettings, rangeSettings);

        // create preference records for each user and save them
        for(let i = 0; i < numberOfUsers; i++) {
          let user = userRecordArray[i];
          let uid = user.get('id');

          for(let j = 0; j < allSettings.length; j++) {
            const preferenceRecord = this.get('store').createRecord('userpreference', {
              userId: uid,
              settingId: allSettings[j][0],
              value: allSettings[j][1]
            });
            settingsPromiseArray.push(preferenceRecord.save());
          }
        }

        // if all settings are created successfully, notify user
        // else delete the user and notify user about failure
        return new allSettled(settingsPromiseArray).then((array)=>{
          let failed;
          for(let i = 0; i < array.length; i++) {
            let { state } = array[i];
            if(state === 'rejected') {
              failed = array[i];
            }
          }
  
          if(failed !== undefined) {
            let { reason } = failed;
            this.set('showSpinner', false);
            this.showReasonErrorAlert(reason);
            for(let i = 0; i < numberOfUsers; i++) {
              let user = userRecordArray[i];
              user.destroyRecord();
            }
          } else {
            this.set('showSpinner', false);
            const message = `All users were successfully created.`;
            this.showAlertifySuccess(message);
            clearInputFields.bind(this)();
            this.showCreatedUsers(userRecordArray);
          }
        });
      }
    },
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

  showCreatedUsers(userList) {
    this.set('createdUsers', userList.sort((user1, user2) => parseInt(user1.id) < parseInt(user2.id) ? -1 : 1));
    this.set('showNewUsers', true);
  },

  getRoles: task(function * () {
    yield this.set('roles', this.store.findAll('role'));
  })
});
