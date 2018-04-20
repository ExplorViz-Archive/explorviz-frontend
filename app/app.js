import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import Application from '@ember/application';

/**
* Ember application is the starting point for every Ember application.
* 
* @class Application
* @extends Ember.Application
*
* @module ember
*/
let App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
