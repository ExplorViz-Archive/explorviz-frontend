import Ember from 'ember';

export function initialize(appInstance) {
  const config = appInstance.resolveRegistration("config:environment");

  if(config.environment !== 'production') {
    return;
  }

  Ember.$.getJSON('configuration.json')
    .done(function(jsonConfig) {

      config.APP.API_ROOT = jsonConfig.API_ROOT;

    })
    .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log("Couldn't load configuration.json: " + err );
    });
}

export default {
  name: 'environment-updater',
  initialize
};
