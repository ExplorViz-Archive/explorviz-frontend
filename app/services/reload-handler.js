import Service from '@ember/service';
import Evented from '@ember/object/evented';
//import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';

export default Service.extend(AlertifyHandler, Evented, {

  /*
  isReloading: computed('timeshiftReload.shallUpdate', function() {
    return this.get('timeshiftReload.shallUpdate');
  }),*/

  //timeshiftReload: service("timeshift-reload"),
  //landscapeReload: service("landscape-reload"),
  landscapeRepo: service("repos/landscape-repository"),
  store: service(),


  stopExchange() {
    //this.get('landscapeReload').stopUpdate();
    //this.get('timeshiftReload').stopUpdate();
    this.trigger('stopExchange');
  },


  startExchange() {
    //this.get('landscapeReload').startUpdate();
    //this.get('timeshiftReload').startUpdate();
    this.trigger('startExchange');
  },


  loadLandscapeById(timestamp, appID) {

    const self = this;

    self.debug("start import landscape-request");

    this.get('store').queryRecord('landscape',
      'by-timestamp/' + timestamp).then(success, failure).catch(error);

    function success(landscape){
      self.set('landscapeRepo.latestLandscape', landscape);
      self.get('landscapeRepo').triggerUpdate();

      if(appID) {
        const app = self.get('store').peekRecord('application', appID);
        self.set('landscapeRepo.latestApplication', app);
      }

      self.debug("end import landscape-request");
    }

    function failure(e){
      self.set('landscapeRepo.latestLandscape', undefined);
      self.showAlertifyMessage("Landscape couldn't be requested!" +
        " Backend offline?");
      self.debug("Landscape couldn't be requested!", e);
    }

    function error(e){
      self.set('landscapeRepo.latestLandscape', undefined);
      self.debug("Error when fetching landscape: ", e);
    }

  },

  loadOldLandscapeById(timestamp, appID) {

    const self = this;

    self.debug("start import landscape-request");

    this.get('store').queryRecord('landscape',
      'by-uploaded-timestamp/' + timestamp).then(success, failure).catch(error);

    function success(landscape){
      self.set('landscapeRepo.replayLandscape', landscape);
      self.get('landscapeRepo').triggerUpdate();

      if(appID) {
        const app = self.get('store').peekRecord('application', appID);
        self.set('landscapeRepo.replayApplication', app);
      }

      self.debug("end import uploaded-landscape-request");
    }

    function failure(e){
      self.set('landscapeRepo.replayLandscape', undefined);
      self.showAlertifyMessage("Uploaded landscape couldn't be requested!" +
        " Backend offline?");
      self.debug("Uploaded landscape couldn't be requested!", e);
    }

    function error(e){
      self.set('landscapeRepo.replayLandscape', undefined);
      self.debug("Error when fetching uploaded landscape: ", e);
    }

  }
});
