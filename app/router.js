import Ember from 'ember';
import config from './config/environment';

const {Router} = Ember;

/**
* Ember router for mapping "route" and respective "template".
* 
* @class Router
* @extends Ember.Router
*
* @module ember
*/
const Router = Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('visualization');
  this.route('tutorial');
  this.route('administration');
  this.route('login');
  this.route('badroute', { path: "/*path" });
  this.route('configuration');
});

export default Router;
