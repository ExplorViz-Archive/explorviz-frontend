import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class Replay extends BaseRoute.extend(AuthenticatedRouteMixin) {

  // @Override
  setupController(controller: any, model: any) {
    // Call _super for default behavior
    this._super(controller, model);
    controller.initController();
  }

  // @Override BaseRoute
  resetRoute() {
  }

}
