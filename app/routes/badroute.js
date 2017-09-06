import Ember from 'ember';

const {Route} = Ember;

/**
* TODO
* 
* @class Badroute-Route
* @extends Ember.Route
*/
export default Route.extend({

  redirect : function(){
        this.replaceWith("index");
    }

});
