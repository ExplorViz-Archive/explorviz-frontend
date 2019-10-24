import Service from '@ember/service';
import { inject as service } from "@ember/service";
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

  replayTimelineTimestamps: Timestamp[] = [];

  /**
   * Triggers the 'updated' event in the timeline for updating the chart
   * @method triggerTimelineUpdate
   */
  triggerTimelineUpdate() {
    this.trigger("updated", this.get('latestTimestamp'));
  }

  // TODO triggerTimelineUpdate for replay timeline
  fetchReplayTimestamps() {
    const self = this;
    self.debug("Start fetching replay timestamps");

    self.get('store').query('timestamp', { type: 'replay' }).then(success, failure).catch(error);

    function success(fetchedTimestamps: DS.PromiseArray<Timestamp>) {

      const replayTimestamps: Timestamp[] = [];

      fetchedTimestamps.forEach(timestamp => {
        replayTimestamps.push(timestamp);
      });

      self.set('replayTimelineTimestamps', replayTimestamps);
      self.triggerTimelineUpdate();
      self.debug("Replay Timestamps successfully loaded!");
    }

    function failure(e: any) {
      self.set('timelineTimestamps', []);
      self.debug("Replay Timestamps couldn't be requested!", e);
    }

    function error(e: any) {
      self.set('timelineTimestamps', []);
      self.debug("Error when fetching replay timestamps: ", e);
    }

    self.debug("End fetching replay timestamps");
  }

}

declare module "@ember/service" {
  interface Registry {
    "repos/timestamp-repository": TimestampRepository;
  }
}
