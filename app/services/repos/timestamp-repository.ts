import Service from '@ember/service';
import { inject as service } from "@ember/service";
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import Timestamp from 'explorviz-frontend/models/timestamp';

/**
* TODO
*
* @class Timestamp-Repository-Service
* @extends Ember.Service
*/
export default class TimestampRepository extends Service.extend(Evented) {

  debug = debugLogger();

  @service('store') store !: any;

  latestTimestamp: any = null;
  timelineTimestamps: Timestamp[] = [];

  replayTimelineTimestamps: Timestamp[] = [];

  init() {
    this._super(...arguments);
    this.set('timelineTimestamps', []);
    this.set('replayTimelineTimestamps', []);
  };

  /**
   * Triggers the 'updated' event in the timeline for updating the chart
   * @method triggerTimelineUpdate
   */
  triggerTimelineUpdate() {
    this.trigger("updated", this.get('latestTimestamp'));
  }

  /**
   * Triggers the 'updated' event in the replayTimeline for updating the chart
   * @method triggerReplayTimelineUpdate
   */
  triggerReplayTimelineUpdate() {
    this.trigger("updated", this.get('replayTimelineTimestamps'));
  }

  fetchReplayTimestamps() {
    const self = this;
    self.debug("Start fetching replay timestamps");

    self.get('store').query('timestamp', { type: 'replay' }).then(success, failure).catch(error);

    function success(replayTimestamps: Timestamp[]) {
      self.set('replayTimelineTimestamps', replayTimestamps);
      self.debug("Replay Timestamps successfully loaded!");
    }

    function failure(e: any) {
      self.set('timelineTimestamps', undefined);
      self.debug("Replay Timestamps couldn't be requested!", e);
    }

    function error(e: any) {
      self.set('timelineTimestamps', undefined);
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
