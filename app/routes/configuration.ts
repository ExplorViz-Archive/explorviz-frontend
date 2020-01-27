import { action } from '@ember/object';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ConfigurationController from 'explorviz-frontend/controllers/configuration';
import BaseRoute from 'explorviz-frontend/routes/base-route';

/**
 * TODO
 *
 * @class Configuration-Route
 * @extends Ember.Route
 */
export default class ConfigurationRoute extends BaseRoute.extend(AuthenticatedRouteMixin) {
  @action
  didTransition() {
    (this.controller as ConfigurationController).hideTimeline();
  }
}
