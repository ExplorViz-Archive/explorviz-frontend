import Route from '@ember/routing/route';

/**
* TODO
* 
* @class Index-Route
* @extends Ember.Route
*/
export default Route.extend({

  beforeModel() {
    this._super(...arguments);
    this.replaceWith('login');
  }
  
});