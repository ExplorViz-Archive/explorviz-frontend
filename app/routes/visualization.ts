import BaseRoute from './base-route';
import AuthenticatedRouteMixin from 
  'ember-simple-auth/mixins/authenticated-route-mixin';
import { action } from '@ember/object';
import VisualizationController from 'explorviz-frontend/controllers/visualization';
import Controller from '@ember/controller';
import THREE from 'three';
import debugLogger from 'ember-debug-logger';

/**
* TODO
*
* @class Visualization-Route
* @extends Ember.Route
*/
export default class VisualizationRoute extends BaseRoute.extend(AuthenticatedRouteMixin) {

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
  setupController(controller:Controller, model:any) {
    // Call _super for default behavior
    super.setupController(controller, model);

    (controller as VisualizationController).initRendering();
  }

  // @Override BaseRoute
  @action
  resetRoute() {
    this.controller.send('resetView');
    (this.controller as VisualizationController).landscapeRepo.set('latestApplication', null);
  }

}
