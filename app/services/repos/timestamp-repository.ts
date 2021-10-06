import Service from '@ember/service';

import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';

export interface Timestamp {
  id: string,
  timestamp: number,
  data: Map<string, number> // inspectITs key to value
}

export interface StructuredTimestamp {
  id: string,
  timestamp: number,
  structuredData: Map<string, Timestamp>, //Application based timestamps
  generalData : Timestamp //Landscape based timestamp
}

/**
* Handles all landscape-related timestamps within the application, especially for the timelines
*
* @class Timestamp-Repository-Service
* @extends Ember.Service
*/
export default class TimestampRepository extends Service.extend(Evented) {
  debug = debugLogger();

  private structuredTimestamps: Map<string, StructuredTimestamp[]> = new Map();
  latestApplication: string | null = null
  minTimestamp: number = Date.now() - (6 * 60 * 1000);;
  maxTimestamp: number = Date.now();

  getTimestamps(landscapeToken: string, application: string) {
    this.set('latestApplication', application);
    const landscape = this.structuredTimestamps.get(landscapeToken);
    if (landscape) {
      return (application !== '' ? landscape.map(x => x.structuredData.get(application)!) : landscape.map(x => x.generalData));
    }
    return []
  }

  getFirstTimestamp(landscapeToken: string) {
    const timestamps = this.getTimestamps(landscapeToken, this.latestApplication!);
    if (timestamps) {
      return timestamps[0];
    }

    return undefined;
  }

  getLatestTimestamp(landscapeToken: string) {
    const timestamps = this.getTimestamps(landscapeToken, this.latestApplication!);
    if (timestamps) {
      return timestamps[timestamps.length - 1];
    }

    return undefined;
  }

  addTimestamp(landscapeToken: string, structuredTimestamp: StructuredTimestamp, reverse: boolean = false) {
    const structuredtimestamps = this.structuredTimestamps.get(landscapeToken);
    if (structuredtimestamps) {
      if (reverse) {
        this.structuredTimestamps.set(landscapeToken, [structuredTimestamp, ...structuredtimestamps]);
      } else {
        this.structuredTimestamps.set(landscapeToken, [...structuredtimestamps, structuredTimestamp]);
      }
    } else {
      this.structuredTimestamps.set(landscapeToken, [structuredTimestamp]);
    }
  }

  // Updates the to be loaded timestamps
  filterSlidingWindow(landscapeToken: string) {
    const timestamps = this.structuredTimestamps.get(landscapeToken);

    if (timestamps) {
      const first = timestamps[0].timestamp;
      const last = timestamps[timestamps?.length - 1].timestamp;
      if (first > this.maxTimestamp || last < this.minTimestamp) {
        this.structuredTimestamps.set(landscapeToken, []);
      } else {
        this.structuredTimestamps.set(landscapeToken, timestamps.filter(x => this.minTimestamp <= x.timestamp && x.timestamp <= this.maxTimestamp));
      }
    }
  }

  /**
   * Triggers the 'updated' event in the timeline for updating the chart
   * @method triggerTimelineUpdate
   */
  triggerTimelineUpdate() {
    this.trigger('updated');
  }
}

declare module '@ember/service' {
  interface Registry {
    'repos/timestamp-repository': TimestampRepository;
  }
}