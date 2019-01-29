import Service from '@ember/service';
import config from 'explorviz-frontend/config/environment';
import { inject as service } from "@ember/service";
import { getOwner } from '@ember/application';
import ModelUpdater from 'explorviz-frontend/utils/model-update';
import debugLogger from 'ember-debug-logger';

/* global EventSourcePolyfill */
export default Service.extend({

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

  init(){
    this._super(...arguments);
    if (!this.get('modelUpdater')) {
      this.set('modelUpdater', ModelUpdater.create(getOwner(this).ownerInjection()));
    }
  },

  initSSE() {

    this.set('content', []);

    const self = this;

    const url = config.APP.API_ROOT;
    const { access_token } = this.get('session.data.authenticated');

    // close former event source. Multiple (>= 6) instances cause the ember store to no longer work
    if(this.get('es')) {
      this.get('es').close();
    }

    // ATTENTION: This is a polyfill (see vendor folder)
    // Replace if original EventSource API allows HTTP-Headers
    this.set('es', new EventSourcePolyfill(`${url}/v1/landscapes/broadcast/`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }));

    this.set('es.onmessage', function(e) {
      const jsonLandscape = JSON.parse(e.data);

      if (jsonLandscape && jsonLandscape.hasOwnProperty("data") &&
        JSON.stringify(jsonLandscape) !== JSON.stringify(self.get('latestJsonLandscape'))) {

        // pause active -> no landscape visualization update
        // do avoid update of store to prevent inconsistencies between visualization and e.g. trace data
        if (self.pauseVisualizationReload) {
          self.debug("SSE: Updating visualization paused")
          return;
        }

        // console.log("JSON: " + JSON.stringify(jsonLandscape));

        // ATTENTION: Mind the push operation, push != pushPayload in terms of 
        // serializer usage
        // https://github.com/emberjs/data/issues/3455
        self.set('latestJsonLandscape', jsonLandscape);
        const landscapeRecord = self.get('store').push(jsonLandscape);

        self.get('modelUpdater').addDrawableCommunication();

        self.set('landscapeRepo.latestLandscape', landscapeRecord);
        self.get('landscapeRepo').triggerLatestLandscapeUpdate();
        self.get('timestampRepo').addTimestampToList(landscapeRecord.get('timestamp'));
        self.get('timestampRepo').triggerUpdated();
      }     
    });
  },

  subscribe(url, fn){

    const self = this;   

    let source = new EventSource(url);
    source.onmessage = function(e){
      fn(e.data);
    };
    source.onerror = function(e){
      if (source.readyState == EventSource.CLOSED) return;
      self.error(e);
    };
    return source.close.bind(source);
  },

  toggleVisualizationReload(){
    self.debug("Toggle Visualization Reload");
    this.set('pauseVisualizationReload', !this.get('pauseVisualizationReload'));
  }

});
