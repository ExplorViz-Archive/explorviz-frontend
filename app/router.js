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
  rootURL: config.rootURL,
  configurationRouteExtensions: null,
});

Router.map(function () {

  this.route('badroute', { path: "/*path" });
  this.route('base-route');
  this.route('login');
  this.route('visualization');
  this.route('discovery');

  this.route('configuration', function () {

    const configurationRouteContext = this;

    this.route('usermanagement', function () {
      this.route('users');
      this.route('edit', { path: '/edit/:user_id' });
      this.route('new');
    });

    // this.route('settings');

    // add nested configuration routes towards the added by extensions
    Router.configurationRouteExtensions.forEach(function (extensionRoute) {
      if (extensionRoute !== 'undefined') {
        configurationRouteContext.route(extensionRoute);
      }
    });

  });
});

export default Router;