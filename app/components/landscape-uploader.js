import Component from '@ember/component';
import {inject as service} from '@ember/service';
import { get } from '@ember/object';
import {task} from 'ember-concurrency';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import ENV from 'explorviz-frontend/config/environment';


export default Component.extend(AlertifyHandler, {

  store: service(),
  versionbarLoad: service("versionbar-load"),

  uploadOldLandscape: task(function * (file) {
    const self = this;

    file.readAsDataURL().then(function (url) {
      self.debug('url: ', url);
    });

    try {
        let response = yield file.upload(ENV.APP.API_ROOT + '/landscape/upload-landscape');

        if(response){
          this.get('versionbarLoad').receiveUploadedObjects();
        }
      } catch (e) {
        this.debug('error in file.upload ', e);
      }
  }).maxConcurrency(100).enqueue(),

  actions: {
    uploadLandscape(file) {
      if(file.get('name').endsWith(".expl")){
        get(this, 'uploadOldLandscape').perform(file);
      } else{
        this.showAlertifyMessage("You can only upload .expl files.");
      }
    }
  }
});
