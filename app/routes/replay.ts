import BaseRoute from 'explorviz-frontend/routes/base-route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { action } from '@ember/object';
import ReplayController from 'explorviz-frontend/controllers/replay';

export default class Replay extends BaseRoute.extend(AuthenticatedRouteMixin) {

  // @Override
  setupController(controller: ReplayController, model: any) {
    // Call _super for default behavior
    this._super(controller, model);
    controller.initController();
  }

  // @Override BaseRoute
  @action resetRoute() {
    this.controller.send('resetView');

    // reset visualization rendering
    this.controller.set('landscapeRepo.latestApplication', null);
    this.controller.set('landscapeRepo.replayApplication', null);
  }

  // @Override
  @action didTransition() {
    this.controller.hideVersionbar();
    this.controller.showTimeline();
  }
}
