import Ember from 'ember';

export default Ember.Controller.extend({

  queryParams: ['timestamp', 'id', 'appName'],

  type: 'landscape',
  id: null,
  appName: null,

  showLandscape: true,
  lastShownApplication: null

});