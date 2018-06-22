import Controller from '@ember/controller';
import { inject as service } from "@ember/service";
import { computed } from "@ember/object";


/**
* TODO
*
* @class Application-Controller
* @extends Ember.Controller
*
* @module explorviz
* @submodule page
*/
export default Controller.extend({

  session: service('session'),
  renderingService: service('rendering-service'),

  username: computed(function(){
    return this.get('session').session.content.authenticated.username;
  })

});
