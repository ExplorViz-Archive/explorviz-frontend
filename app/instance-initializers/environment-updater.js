import $ from 'jquery';

export function initialize(appInstance) {
  const config = appInstance.resolveRegistration("config:environment");

  if(config.environment !== 'production' && 
    config.environment !== 'development') {
    return;
  }

  $.getJSON('configuration.json')
    .done(function(jsonConfig) {

      if(config.environment === 'production') {
        updateProductionEnv(jsonConfig, config);
      } 
      else if(config.environment === 'development') {
        updateDevelopmentEnv(jsonConfig, config);
      }

    })
    .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      this.error("Couldn't load configuration.json: " + err );
    });
}


function updateDevelopmentEnv(jsonConfig, emberConfig) {
  
  if(jsonConfig.DEV_BACKEND_ROOT) {
    emberConfig.APP.API_ROOT = jsonConfig.DEV_BACKEND_ROOT;
  }
  
}


function updateProductionEnv(jsonConfig, emberConfig) {

   if(jsonConfig.PROD_BACKEND_ROOT) {
    emberConfig.APP.API_ROOT = jsonConfig.PROD_BACKEND_ROOT;
  }

   if(jsonConfig.PROD_FRONTEND_ROOT) {
    emberConfig.rootURL = jsonConfig.PROD_FRONTEND_ROOT;
  }

}


export default {
  name: 'environment-updater',
  initialize
};
