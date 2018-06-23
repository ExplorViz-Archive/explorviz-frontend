import Route from '@ember/routing/route';

export default Route.extend({

  actions: {

    resetRoute() {
      const routeName = this.get('routeName');

      throw new Error(`UnsupportedOperationException: Please implement the 
      'resetRoute' action in the '${routeName}' route`);
    }
  }

});
