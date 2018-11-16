 import Route from '@ember/routing/route';

/**
* TODO
* 
* @class Badroute-Route
* @extends Ember.Route
*/
export default Route.extend({

  redirect : function(){
        this.replaceWith('index');
    }

});
