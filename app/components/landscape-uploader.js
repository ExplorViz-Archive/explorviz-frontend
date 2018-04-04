import Component from '@ember/component';
import {inject as service} from '@ember/service';
import Ember from 'ember';
import {task} from 'ember-concurrency';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

const { get, set, inject } = Ember;

export default Component.extend(AlertifyHandler, {
  store: service(),
  versionbarLoad: inject.service("versionbar-load"),

  uploadOldLandscape: task(function * (file) {


    let landscape = this.get('store').createRecord('landscape', {
        filename: get(file, 'name'),
        filesize: get(file, 'size')
      });


    file.readAsDataURL().then(function (url) {
          if (get(landscape, 'url') == null) {
        set(landscape, 'url', url);
      }
    });
try {
  this.debug('before file.upload'); //hier kommt er noch hin
    let response = yield file.upload('http://localhost:8083/landscape/upload-landscape');
    this.debug('response in landscape-uploader: ', response); //hier nicht
    if(response){
      this.get('versionbarLoad').receiveUploadedObjects();
    }
    // console.log('response in uploadOldLandscape: ', response);
    set(landscape, 'url', response.headers.Location);
      yield landscape.save();
  } catch (e) {
    this.debug('error in file.upload ', e);
    //landscape.rollback();
  }
}).maxConcurrency(3).enqueue(),

actions: {
  uploadLandscape(file) {
    if(file.get('name').endsWith(".expl")){
    get(this, 'uploadOldLandscape').perform(file);
  }else{
    this.showAlertifyMessage("You can only upload .expl files.");
  }
}
}
});
