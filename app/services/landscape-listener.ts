import Service, { inject as service } from '@ember/service';
import config from 'explorviz-frontend/config/environment';
import Evented from '@ember/object/evented';
import addDrawableCommunication from 'explorviz-frontend/utils/model-update';
import debugLogger from 'ember-debug-logger';
import DS from 'ember-data';
import { set } from '@ember/object';
import Landscape from 'explorviz-frontend/models/landscape';
import Timestamp from 'explorviz-frontend/models/timestamp';
import LandscapeRepository from './repos/landscape-repository';
import TimestampRepository from './repos/timestamp-repository';

declare const EventSourcePolyfill: any;

export default class LandscapeListener extends Service.extend(Evented) {
  // https://github.com/segmentio/sse/blob/master/index.js

  content: any = null;

  @service('session') session!: any;

  @service('store') store!: DS.Store;

  @service('repos/timestamp-repository') timestampRepo!: TimestampRepository;

  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;

  latestJsonLandscape = null;

  es: any = null;

  pauseVisualizationReload = false;

  debug = debugLogger();

  initSSE() {
    set(this, 'content', []);

    const url = config.APP.API_ROOT;
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { access_token } = this.session.data.authenticated;

    // Close former event source. Multiple (>= 6) instances cause the ember store to no longer work
    let { es } = this;
    if (es) {
      es.close();
    }

    // ATTENTION: This is a polyfill (see vendor folder)
    // Replace if original EventSource API allows HTTP-Headers
    set(this, 'es', new EventSourcePolyfill(`${url}/v1/landscapes/broadcast/`, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        Authorization: `Bearer ${access_token}`,
      },
    }));

    es = this.es;

    set(es, 'onmessage', (event: any) => {
      const jsonLandscape = JSON.parse(event.data);

      if (jsonLandscape && Object.prototype.hasOwnProperty.call(jsonLandscape, 'data')) {
        // Pause active -> no landscape visualization update
        // Do avoid update of store to prevent inconsistencies
        // between visualization and e.g. trace data
        if (!this.pauseVisualizationReload) {
          this.store.unloadAll('tracestep');
          this.store.unloadAll('trace');
          this.store.unloadAll('clazzcommunication');
          this.store.unloadAll('event');

          // ATTENTION: Mind the push operation, push != pushPayload in terms of
          // serializer usage
          // https://github.com/emberjs/data/issues/3455

          set(this, 'latestJsonLandscape', jsonLandscape);
          const landscapeRecord = this.store.push(jsonLandscape) as Landscape;

          addDrawableCommunication(this.store);

          set(this.landscapeRepo, 'latestLandscape', landscapeRecord);
          this.landscapeRepo.triggerLatestLandscapeUpdate();

          const timestampRecord = landscapeRecord.timestamp;

          timestampRecord.then((record) => {
            this.updateTimestampRepoAndTimeline(record);
          });
        } else {
          // visualization is paused
          this.debug('Visualization update paused');

          // hacky way to obtain the timestamp record, without deserializing
          // the complete landscape record and poluting the store
          const timestampId = jsonLandscape.data.relationships.timestamp.data.id;

          const includedArray = jsonLandscape.included;

          let timestampValue;
          let totalRequests;

          // eslint-disable-next-line no-restricted-syntax
          for (const elem of includedArray) {
            /* eslint-disable-next-line eqeqeq */
            if (elem.id == timestampId) {
              timestampValue = elem.attributes.timestamp;
              totalRequests = elem.attributes.totalRequests;
              break;
            }
          }

          const timestampRecord = this.store.createRecord('timestamp', {
            id: timestampId,
            timestamp: timestampValue,
            totalRequests,
          });
          this.updateTimestampRepoAndTimeline(timestampRecord);
        }
      }
    });
  }

  updateTimestampRepoAndTimeline(this: LandscapeListener, timestamp: Timestamp) {
    set(this.timestampRepo, 'latestTimestamp', timestamp);

    // this syntax will notify the template engine to redraw all components
    // with a binding to this attribute
    set(this.timestampRepo, 'timelineTimestamps', [...this.timestampRepo.timelineTimestamps, timestamp]);

    this.timestampRepo.triggerTimelineUpdate();
  }

  toggleVisualizationReload() {
    // TODO: need to notify the timeline
    if (this.pauseVisualizationReload) {
      this.startVisualizationReload();
    } else {
      this.stopVisualizationReload();
    }
  }

  startVisualizationReload() {
    set(this, 'pauseVisualizationReload', false);
    this.trigger('visualizationResumed');
  }

  stopVisualizationReload() {
    set(this, 'pauseVisualizationReload', true);
  }
}

declare module '@ember/service' {
  interface Registry {
    'landscape-listener': LandscapeListener;
  }
}
