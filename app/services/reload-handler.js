import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {

  isReloading: Ember.computed('timeshiftReload.shallUpdate', function() {
    return this.get('timeshiftReload.shallUpdate');
  }),

  timeshiftReload: Ember.inject.service("timeshift-reload"),  
  landscapeReload: Ember.inject.service("landscape-reload"),


  stopExchange() {    
    this.get('landscapeReload').stopUpdate();
    this.get('timeshiftReload').stopUpdate();
    this.trigger('stopExchange');
  },


  startExchange() {    
    this.get('landscapeReload').startUpdate();
    this.get('timeshiftReload').startUpdate();
    this.trigger('startExchange');
  }
});
