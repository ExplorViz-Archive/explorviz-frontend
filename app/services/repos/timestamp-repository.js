import Service from '@ember/service';
import Evented from '@ember/object/evented';

/**
* TODO
*
* @class Timestamp-Repository-Service
* @extends Ember.Service
*/
export default Service.extend(Evented, {

  latestTimestamps: null,
  uploadedTimestamps:null,

  // @Override
  init() {
    this._super(...arguments);
    this.set('latestTimestamps', []);
  },

  addTimestampToList(timestampRecord) {
    this.get('latestTimestamps').push(timestampRecord);
  },

  triggerUpdated(){
    this.trigger("updated");
  },

  triggerUploaded(){
    this.trigger("uploaded", this.get("uploadedTimestamps"));
  }

});
