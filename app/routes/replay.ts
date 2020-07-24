import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { set } from '@ember/object';
import ReplayController from 'explorviz-frontend/controllers/replay';
import debugLogger from 'ember-debug-logger';
import THREE from 'three';

export default class Replay extends Route.extend(AuthenticatedRouteMixin) {
  debug = debugLogger();

  model() {
    return new Promise((resolve, reject) => {
      new THREE.FontLoader().load(
        // resource URL
        '/three.js/fonts/roboto_mono_bold_typeface.json',

        // onLoad callback
        (font) => {
          resolve(font);
          this.debug('(THREE.js) font sucessfully loaded.');
        },
        undefined,
        (e) => {
          reject(e);
          this.debug('(THREE.js) font failed to load.');
        },
      );
    });
  }

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
      // controller.send('resetView');

      // reset visualization rendering
      set(controller.landscapeRepo, 'latestApplication', null);
      set(controller.landscapeRepo, 'replayApplication', null);
    }
  }
}
