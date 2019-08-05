import Service from '@ember/service';
import Evented from '@ember/object/evented';

import debugLogger from 'ember-debug-logger';

/**
* TODO
*
* @class Timestamp-Repository-Service
* @extends Ember.Service
*/
export default class TimestampRepository extends Service.extend(Evented) {

  debug = debugLogger();

  latestTimestamp:any = null;
  timelineTimestamps = [];

  init() {
    this._super(...arguments);
    this.set('timelineTimestamps', []);
  };

  /**
   * Triggers the 'updated' event in the timeline for updating the chart
   * @method triggerTimelineUpdate
   */
  triggerTimelineUpdate() {
    this.trigger("updated", this.get('latestTimestamp'));
  }

}

declare module "@ember/service" {
  interface Registry {
    "repos/timestamp-repository": TimestampRepository;
  }
}
