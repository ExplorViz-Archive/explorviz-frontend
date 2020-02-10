import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { set } from '@ember/object';
import ReplayController from 'explorviz-frontend/controllers/replay';

export default class Replay extends Route.extend(AuthenticatedRouteMixin) {
  // @Override
  setupController(controller: ReplayController, model: any) {
    // Call _super for default behavior
    super.setupController(controller, model);
    controller.initController();
  }

  // @Override Ember-Hook
  /* eslint-disable-next-line class-methods-use-this */
  resetController(controller: ReplayController, isExiting: boolean, transition: any) {
    if (isExiting && transition.targetName !== 'error') {
      controller.send('resetView');

      // reset visualization rendering
      set(controller.landscapeRepo, 'latestApplication', null);
      set(controller.landscapeRepo, 'replayApplication', null);
    }
  }
}
