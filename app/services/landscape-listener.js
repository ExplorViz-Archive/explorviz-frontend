import Service from '@ember/service';
import config from 'explorviz-frontend/config/environment';
import { inject as service } from "@ember/service";
import { getOwner } from '@ember/application';
import Evented from '@ember/object/evented';
import ModelUpdater from 'explorviz-frontend/utils/model-update';
import debugLogger from 'ember-debug-logger';

/* global EventSourcePolyfill */
export default Service.extend(Evented, {

  // https://github.com/segmentio/sse/blob/master/index.js

  content: null,
  session: service(),
  store: service(),
  timestampRepo: service("repos/timestamp-repository"),
  landscapeRepo: service("repos/landscape-repository"),
  latestJsonLandscape: null,
  modelUpdater: null,
  es: null,

  pauseVisualizationReload: false,

  debug: debugLogger(),

  init() {
    this._super(...arguments);
    if (!this.get('modelUpdater')) {
      this.set('modelUpdater', ModelUpdater.create(getOwner(this).ownerInjection()));
    }
  },

  initSSE() {
    this.set('content', []);

    const url = config.APP.API_ROOT;
    const { access_token } = this.get('session.data.authenticated');

    // Close former event source. Multiple (>= 6) instances cause the ember store to no longer work
    if (this.get('es')) {
      this.get('es').close();
    }

    // ATTENTION: This is a polyfill (see vendor folder)
    // Replace if original EventSource API allows HTTP-Headers
    this.set('es', new EventSourcePolyfill(`${url}/v1/landscapes/broadcast/`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }));

    this.set('es.onmessage', (event) => {
      const jsonLandscape = JSON.parse(event.data);

      if (jsonLandscape && jsonLandscape.hasOwnProperty("data")) {

        // Pause active -> no landscape visualization update
        // Do avoid update of store to prevent inconsistencies between visualization and e.g. trace data
        if (!this.get('pauseVisualizationReload')) {
          this.debug("Visualization update paused");

          this.get('store').unloadAll('tracestep');
          this.get('store').unloadAll('trace');
          this.get('store').unloadAll('clazzcommunication');
          this.get('store').unloadAll('event');
          
        }

        // ATTENTION: Mind the push operation, push != pushPayload in terms of 
        // serializer usage
        // https://github.com/emberjs/data/issues/3455
        this.set('latestJsonLandscape', jsonLandscape);
        const landscapeRecord = this.get('store').push(jsonLandscape);

        if (!this.get('pauseVisualizationReload')) {
          this.get('modelUpdater').addDrawableCommunication();

          this.set('landscapeRepo.latestLandscape', landscapeRecord);
          this.get('landscapeRepo').triggerLatestLandscapeUpdate();          
        }        

        const timestamp = landscapeRecord.get('timestamp');

        this.set('timestampRepo.latestTimestamp', timestamp);

        // this syntax will notify the template engine to redraw all components
        // with a binding to this attribute
        this.set('timestampRepo.timelineTimestamps', [...this.timestampRepo.timelineTimestamps, timestamp]);

        this.get('timestampRepo').triggerTimelineUpdate();
      }
    });
  },

  subscribe(url, fn) {
    let source = new EventSource(url);

    source.onmessage = (event) => {
      fn(event.data);
    };

    source.onerror = (event) => {
      if (source.readyState !== EventSource.CLOSED)
        this.error(event);
    };

    return source.close.bind(source);
  },

  toggleVisualizationReload() {
    // TODO: need to notify the timeline
    if (this.pauseVisualizationReload) {
      this.startVisualizationReload();
    } else {
      this.stopVisualizationReload();
    }
  },

  startVisualizationReload() {
    this.set('pauseVisualizationReload', false);
    this.trigger("visualizationResumed");
  },

  stopVisualizationReload() {
    this.set('pauseVisualizationReload', true);
  }

});
