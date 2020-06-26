import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Auth from 'explorviz-frontend/services/auth';

/**
 * TODO
 *
 * @class ApplicationRoute
 * @extends Route
 */
// @ts-ignore
export default class ApplicationRoute extends Route {
  @service
  auth!: Auth;
}
