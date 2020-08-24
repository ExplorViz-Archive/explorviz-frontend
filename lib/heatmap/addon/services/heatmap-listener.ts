import Service, { inject as service } from '@ember/service';
import config from 'explorviz-frontend/config/environment';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import { set, computed } from '@ember/object';
import DS from 'ember-data';
import LandscapeListener from 'explorviz-frontend/services/landscape-listener';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import Heatmap from 'heatmap/models/heatmap';
import HeatmapRepository, { Metric } from './repos/heatmap-repository';

declare const EventSourcePolyfill: any;

export default class HeatmapListener extends Service.extend(Evented) {
  // https://github.com/segmentio/sse/blob/master/index.js

  content: any = null;

  @service('session') session!: any;

  @service('store') store!: DS.Store;

  @service('landscape-listener') landscapeListener!: LandscapeListener;

  @service('repos/heatmap-repository') heatmapRepo!: HeatmapRepository;

  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;

  es: any = null;

  @computed('landscapeListener.pauseVisualizationReload')
  get pauseVisualizationReload() {
    return this.landscapeListener.pauseVisualizationReload;
  }

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
    set(this, 'es', new EventSourcePolyfill(`${url}/v1/heatmap/broadcast/`, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        Authorization: `Bearer ${access_token}`,
      },
    }));

    es = this.es;

    set(es, 'onmessage', (event: any) => {
      const jsonHeatmap = JSON.parse(event.data);

      if (jsonHeatmap && Object.prototype.hasOwnProperty.call(jsonHeatmap, 'data')) {
        this.debug('Received new Heatmap.');
        if (!this.pauseVisualizationReload) {
          // this.store.unloadAll('heatmap');
          // this.store.unloadAll('landscape-metric-collection');
          // this.store.unloadAll('landscape-metric');
          // this.store.unloadAll('application-metric');
          // this.store.unloadAll('clazz-metric');

          const heatmapRecord: Heatmap = this.store.push(jsonHeatmap) as Heatmap;

          // Register the metrics the first time they are pushed.
          if (this.heatmapRepo.metrics.length === 0) {
            const metrics: Metric[] = [];

            jsonHeatmap.data.attributes.metricTypes.forEach((type: string) => {
              const metric = this.store.peekAll(type).objectAt(0);
              metrics.push({
                name: metric.name,
                typeName: metric.typeName,
                description: metric.description,
              });
            });

            set(this.heatmapRepo, 'metrics', metrics);
            this.debug('Updated metric list.');
          }

          this.get('heatmapRepo').updateLatestHeatmap(heatmapRecord);
        } else {
          // visualization is paused
          this.debug('Visualization update paused');
        }
      }
    });
  }
}

declare module '@ember/service' {
  interface Registry {
    'heatmap-listener': HeatmapListener;
  }
}
