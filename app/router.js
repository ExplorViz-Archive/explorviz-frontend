import config from './config/environment';
import EmberRouter from '@ember/routing/router';


/**
* Ember router for mapping "route" and respective "template".
*
* @class Router
* @extends Ember.Router
*
* @module ember
*/
const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('visualization');
  this.route('login');
  this.route('badroute', { path: "/*path" });
  this.route('configuration');
  this.route('base-route');
  this.route('discovery');
});

export default Router;
