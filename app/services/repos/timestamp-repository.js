import Ember from 'ember';

const {Service, observer, Evented} = Ember;

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
