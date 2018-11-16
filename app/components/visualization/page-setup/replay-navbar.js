import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { get } from '@ember/object';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';
import ENV from 'explorviz-frontend/config/environment';
import debugLogger from 'ember-debug-logger';

export default Component.extend(AlertifyHandler, FileSaverMixin, {

  // No Ember generated container
  tagName: '',

  debug: debugLogger(),

  renderingService: service(),
  store: service(),
  versionbarLoad: service("versionbar-load"),
  session: service(),

  isAuthenticated: computed.oneWay("session.isAuthenticated"),

  uploadOldLandscape: task(function * (file) {
    const self = this;

    file.readAsDataURL().then(function (url) {
      self.debug('url: ', url);
    });

    try {

      if(this.get("isAuthenticated") === true) {

        // let { access_token } = this.get('session.data.authenticated');

        let response = yield file.upload(
          ENV.APP.API_ROOT + '/landscape/upload-landscape',
          {
            //headers: {TOKEN: access_token}
          }
        );

        if (response) {
          this.get('versionbarLoad').receiveUploadedObjects();
        }
      }
      else {
        this.showAlertifyMessage("Authentication error.");
      }
    } catch (e) {
      this.debug('error in file.upload ', e);
    }
  }).maxConcurrency(100).enqueue(),

  actions: {
    uploadLandscape(file) {
      if (file.get('name').endsWith(".expl")) {
        get(this, 'uploadOldLandscape').perform(file);
      } else {
        this.showAlertifyMessage("You can only upload .expl files.");
      }
    },

    toggleVersionBar() {
      this.set('renderingService.showVersionbar', !this.get('renderingService.showVersionbar'));
    },
  }
});
