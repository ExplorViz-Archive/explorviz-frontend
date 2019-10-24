import Service from '@ember/service';
import config from 'explorviz-frontend/config/environment';
import { inject as service } from "@ember/service";
import { getOwner } from '@ember/application';
import Evented from '@ember/object/evented';
import ModelUpdater from 'explorviz-frontend/utils/model-update';
import debugLogger from 'ember-debug-logger';
import DS from 'ember-data';
import TimestampRepository from './repos/timestamp-repository';
import LandscapeRepository from './repos/landscape-repository';
import { set } from '@ember/object';
import Landscape from 'explorviz-frontend/models/landscape';
import Timestamp from 'explorviz-frontend/models/timestamp';

declare const EventSourcePolyfill: any;

export default class LandscapeListener extends Service.extend(Evented) {

  // https://github.com/segmentio/sse/blob/master/index.js

  content:any = null;
  @service('session') session!: any;
  @service('store') store!: DS.Store;
  @service('repos/timestamp-repository') timestampRepo!: TimestampRepository;
  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;
  latestJsonLandscape = null;
  modelUpdater = null;
  es = null;

  pauseVisualizationReload = false;

  debug = debugLogger();

  constructor() {
    super(...arguments);
    if (this.modelUpdater === null) {
      set(this, 'modelUpdater', ModelUpdater.create(getOwner(this).ownerInjection()));
    }
  }

  initSSE() {
    set(this, 'content', []);

    const url = config.APP.API_ROOT;
    const { access_token } = this.session.data.authenticated;

    // Close former event source. Multiple (>= 6) instances cause the ember store to no longer work
    let es:any = this.es;
    if (es) {
      es.close();
    }

    // ATTENTION: This is a polyfill (see vendor folder)
    // Replace if original EventSource API allows HTTP-Headers
    set(this, 'es', new EventSourcePolyfill(`${url}/v1/landscapes/broadcast/`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }));

    es = this.es;

    set(es, 'onmessage', (event:any) => {
      const jsonLandscape = JSON.parse(event.data);

      if (jsonLandscape && jsonLandscape.hasOwnProperty('data')) {
        const self = this;

        // Pause active -> no landscape visualization update
        // Do avoid update of store to prevent inconsistencies between visualization and e.g. trace data
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
          
          let modelUpdater:any = this.modelUpdater;
          if(modelUpdater !== null) {
            modelUpdater.addDrawableCommunication();
          }

          set(this.landscapeRepo, 'latestLandscape', landscapeRecord);
          this.landscapeRepo.triggerLatestLandscapeUpdate();          
                
          let timestampRecord = landscapeRecord.timestamp;
          
          timestampRecord.then((record) => {
            updateTimestampRepoAndTimeline(record);
          });
                    
        } else {

          // visualization is paused
          this.debug("Visualization update paused");

          // hacky way to obtain the timestamp record, without deserializing 
          // the complete landscape record and poluting the store
          const timestampId = jsonLandscape["data"]["relationships"]["timestamp"]["data"]["id"];
    
          const includedArray = jsonLandscape["included"];

          let timestampValue;          
          let totalRequests;

          for(var elem of includedArray) {
            if(elem["id"] == timestampId) {
              timestampValue = elem["attributes"]["timestamp"];
              totalRequests = elem["attributes"]["totalRequests"];              
              break;
            }
          }

          let timestampRecord = this.store.createRecord('timestamp', {
            id: timestampId,
            timestamp: timestampValue,
            totalRequests: totalRequests
          });
          updateTimestampRepoAndTimeline(timestampRecord);
        }

        function updateTimestampRepoAndTimeline(timestamp:Timestamp) {
          set(self.timestampRepo, 'latestTimestamp', timestamp);
  
          // this syntax will notify the template engine to redraw all components
          // with a binding to this attribute
          set(self.timestampRepo, 'timelineTimestamps', [...self.timestampRepo.timelineTimestamps, timestamp]);
  
          self.timestampRepo.triggerTimelineUpdate();
        }
      }
    });
  }

  subscribe(url:string, fn:Function) {
    let source = new EventSource(url);

    source.onmessage = (event) => {
      fn(event.data);
    };

    source.onerror = (event) => {
      if (source.readyState !== EventSource.CLOSED)
        console.error(event);
    };

    return source.close.bind(source);
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
    this.trigger("visualizationResumed");
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
