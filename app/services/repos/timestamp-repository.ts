import Service, { inject as service } from '@ember/service';

import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import Timestamp from 'explorviz-frontend/models/timestamp';
import DS from 'ember-data';

/**
* Handles all landscape-related timestamps within the application, especially for the timelines
*
* @class Timestamp-Repository-Service
* @extends Ember.Service
*/
export default class TimestampRepository extends Service.extend(Evented) {
  debug = debugLogger();

  @service('store') store !: DS.Store;

  latestTimestamp: Timestamp|null = null;

  timelineTimestamps: Timestamp[] = [];

  /**
   * Triggers the 'updated' event in the timeline for updating the chart
   * @method triggerTimelineUpdate
   */
  triggerTimelineUpdate() {
    this.trigger('updated', this.get('latestTimestamp'));
  }
}

declare module '@ember/service' {
  interface Registry {
    'repos/timestamp-repository': TimestampRepository;
  }
}
