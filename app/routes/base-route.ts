import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class BaseRoute extends Route {

  @action
  resetRoute() {
    const routeName = this.routeName;

    throw new Error(`UnsupportedOperationException: Please implement the 
    'resetRoute' action in the '${routeName}' route`);
  }

}
