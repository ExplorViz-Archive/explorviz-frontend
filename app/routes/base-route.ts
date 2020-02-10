import { action } from '@ember/object';
import Route from '@ember/routing/route';

export default class BaseRoute extends Route {
  @action
  resetRoute() {
    throw new Error(`UnsupportedOperationException: Please implement the
    'resetRoute' action in the '${this.routeName}' route`);
  }
}
