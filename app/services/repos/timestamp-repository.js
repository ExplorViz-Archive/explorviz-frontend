import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { observer } from '@ember/object';

/**
* TODO
*
* @class Timestamp-Repository-Service
* @extends Ember.Service
*/
export default Service.extend(Evented, {

  latestTimestamps: null,
  uploadedTimestamps:null,

  observer: observer("latestTimestamps", function(){
    this.trigger("updated");
  }),

  triggerUploaded(){
    this.trigger("uploaded", this.get("uploadedTimestamps"));
  }

});
