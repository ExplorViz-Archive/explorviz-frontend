import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { Route } = Ember;

export default Route.extend(AuthenticatedRouteMixin, {

  actions: {
    test(data) {
      console.log("hello from action", data);
    }
  },

  model() {
    return this.store.queryRecord('landscape', 'latest-landscape').then((landscape) => {
      return landscape;
    });
  }

});
