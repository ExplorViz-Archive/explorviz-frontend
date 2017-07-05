import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {

  store: Ember.inject.service(),

  latestLandscape: null,

  latestApplication: null,

  observer: Ember.observer("latestLandscape.timestamp", function(){
    this.trigger("updated", this.get("latestLandscape"));
  }),

  loadLandscapeById(timestamp, appID) {

    const self = this;

    self.debug("start import landscape-request");

    this.get('store').queryRecord('landscape', 
      'by-timestamp/' + timestamp).then(success, failure).catch(error);

    function success(landscape){      
      self.set('latestLandscape', landscape);

      if(appID) {
        const app = self.get('store').peekRecord('application', appID);
        self.set('latestApplication', app);
        self.debug('updated latest', self.get('latestApplication'));
      }

      self.debug("end import landscape-request");
    }
  
    function failure(e){
      self.showAlertifyMessage("Landscape couldn't be requested!" +
        " Backend offline?");
      self.debug("Landscape couldn't be requested!", e);
    }    
    
    function error(e){
      self.debug("Error when fetching landscape: ", e);
    }

  } 

});
