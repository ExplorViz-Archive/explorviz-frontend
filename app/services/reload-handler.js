import Ember from 'ember';
const {Service, inject, computed, Evented} = Ember;

export default Service.extend(Evented, {

  isReloading: computed('timeshiftReload.shallUpdate', function() {
    return this.get('timeshiftReload.shallUpdate');
  }),

  timeshiftReload: inject.service("timeshift-reload"),  
  landscapeReload: inject.service("landscape-reload"),
  landscapeRepo: inject.service("repos/landscape-repository"),
  store: inject.service(),


  stopExchange() {    
    this.get('landscapeReload').stopUpdate();
    this.get('timeshiftReload').stopUpdate();
    this.trigger('stopExchange');
  },


  startExchange() {    
    this.get('landscapeReload').startUpdate();
    this.get('timeshiftReload').startUpdate();
    this.trigger('startExchange');
  },


  loadLandscapeById(timestamp, appID) {

    const self = this;

    self.debug("start import landscape-request");

    this.get('store').queryRecord('landscape', 
      'by-timestamp/' + timestamp).then(success, failure).catch(error);

    function success(landscape){      
      self.set('landscapeRepo.latestLandscape', landscape);

      if(appID) {
        const app = self.get('store').peekRecord('application', appID);
        self.set('landscapeRepo.latestApplication', app);
        console.log("application", app);
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

  }
});
