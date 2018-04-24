import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';
import ApplicationRouteMixin from 
'ember-simple-auth/mixins/application-route-mixin';

/**
* TODO
* 
* @class Application-Route
* @extends Ember.Route
*/
export default Route.extend(ApplicationRouteMixin, {

  session: service(),

  actions: {
    
      logout() {
        this.get('session').invalidate({message: "Logout successful"});
      }
    }

});