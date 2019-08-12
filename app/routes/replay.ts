import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class Replay extends BaseRoute.extend(AuthenticatedRouteMixin) {

  // @Override BaseRoute
  resetRoute() {

  }

}
