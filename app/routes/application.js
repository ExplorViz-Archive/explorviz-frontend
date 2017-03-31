import Ember from 'ember';

import ApplicationRouteMixin from 
'ember-simple-auth/mixins/application-route-mixin';

const { Route } = Ember;

export default Route.extend(ApplicationRouteMixin, {

navbarService: Ember.inject.service('navbar'),

init(){
	this._super();
	this.get('navbarService').navbarLabels.addObject('visualization');
	this.get('navbarService').navbarLabels.addObject('tutorial');
	},

    logout() {
      this.get('session').invalidate();
    }
    
  

  
});