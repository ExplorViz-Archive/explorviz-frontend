import Ember from 'ember';

const {Service, Evented} = Ember;

/**
* TODO
*
* @class Landscape-Repository-Service
* @extends Ember.Service
*/
export default Service.extend(Evented, {

  latestLandscape: null,

  latestApplication: null,

  replayLandscape: null,

  replayApplication:null,

  triggerUpdate(){
    this.trigger("updated", this.get("latestLandscape"));
  }

});
