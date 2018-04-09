import Ember from 'ember';

const {Service, observer, Evented} = Ember;

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

  observer: observer("latestLandscape.timestamp", function(){
    this.trigger("updated", this.get("latestLandscape"));
  })

});
