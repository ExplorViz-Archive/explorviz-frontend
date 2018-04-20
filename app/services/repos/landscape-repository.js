import Service from '@ember/service';
import Evented from '@ember/object/evented';

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
