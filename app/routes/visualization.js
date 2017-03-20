import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { Route } = Ember;

export default Route.extend(AuthenticatedRouteMixin, {

  actions: {
    handleApplication(application){
      this.controller.set("lastShownApplication", application);
      this.controller.set("showLandscape", false);
    }
  },

  model() {
    this.debug("fetch landscape because of route transition");
    return this.store.queryRecord('landscape', 'latest-landscape').then((landscape) => {
      return landscape;
    });
  }

});
