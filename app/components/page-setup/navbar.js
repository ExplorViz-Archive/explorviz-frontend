import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed } from "@ember/object";

export default Component.extend({

  session: service('session'),

  username: computed(function(){
    return this.get('session').session.content.authenticated.username;
  })

});
