import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { Route } = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
    model() {
      console.log(this.get('store').findRecord('landscape',1));   
  }
});
