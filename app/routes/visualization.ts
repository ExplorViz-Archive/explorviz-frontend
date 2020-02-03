import AuthenticatedRouteMixin from 
  'ember-simple-auth/mixins/authenticated-route-mixin';
import VisualizationController from 'explorviz-frontend/controllers/visualization';
import THREE from 'three';
import debugLogger from 'ember-debug-logger';
import Route from '@ember/routing/route';

/**
* TODO
*
* @class Visualization-Route
* @extends Ember.Route
*/
export default class VisualizationRoute extends Route.extend(AuthenticatedRouteMixin) {

  debug = debugLogger();

  model() {
    return new Promise((resolve, reject) => {
      new THREE.FontLoader().load(
        // resource URL
        '/three.js/fonts/roboto_mono_bold_typeface.json',

        // onLoad callback
        font => {
          resolve(font);
          this.debug('(THREE.js) font sucessfully loaded.');
        },
        undefined,
        e => {
          reject(e);
          this.debug('(THREE.js) font failed to load.');
        }
      );
    })
  }

  // @Override
  setupController(controller: VisualizationController, model:any) {
    // Call _super for default behavior
    super.setupController(controller, model);

    controller.initRendering();
  }

  // @Override Ember-Hook
  resetController(controller: VisualizationController, isExiting: boolean, transition: any) {
    if (isExiting && transition.targetName !== 'error') {
      controller.send('resetView');
      controller.landscapeRepo.set('latestApplication', null);
    }
  }

}
