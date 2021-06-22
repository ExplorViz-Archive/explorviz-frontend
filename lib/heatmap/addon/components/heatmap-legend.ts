import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';
import HeatmapConfiguration from 'heatmap/services/heatmap-configuration';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

interface Args {
  descriptions?: {
    aggregatedHeatmap: string,
    windowedHeatmap: string,
    snapshotHeatmap: string
  },
}

export default class HeatmapLegend extends Component<Args> {
  debug = debugLogger();

  @service('heatmap-configuration')
  heatmapConfiguration!: HeatmapConfiguration;

  canvas!: HTMLCanvasElement;

  labelCanvas!: HTMLCanvasElement;

  get descriptions() {
    return this.args.descriptions ?? {
      aggregatedHeatmap: 'Continuously aggregates metric scores by adding a part of the previous metric score to the new (visualized) value.',
      windowedHeatmap: 'Visualizes the alteration for the selected metric considering the last ten scores.',
      snapshotHeatmap: 'Visualizes the metric scores of the currently rendered snapshot.',
    };
  }

  get subHeader() {
    const mode = this.heatmapConfiguration.selectedMode;
    if (mode === 'snapshotHeatmap') {
      return 'Snapshot score:';
    }
    if (mode === 'aggregatedHeatmap') {
      return 'Cont. score:';
    }
    if (mode === 'windowedHeatmap') {
      return 'Windowed difference:';
    }
    return 'Subheader';
  }

  @action
  didInsertCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  @action
  didInsertLegend(div: HTMLDivElement) {
    this.canvas.width = div.clientWidth;
    this.canvas.height = div.clientHeight;

    const ctx = this.canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, this.canvas.height, 0, 0);

    if (this.heatmapConfiguration.useSimpleHeat) {
      const heatmapGradient = this.heatmapConfiguration.getSimpleHeatGradient();
      Object.keys(heatmapGradient).forEach((key) => {
        grad.addColorStop(Number(key), heatmapGradient[key]);
      });
    } else {
      const heatmapGradient = this.heatmapConfiguration.getArrayHeatGradient();
      Object.keys(heatmapGradient).forEach((key) => {
        grad.addColorStop(Number(key) + 0.50, heatmapGradient[key]);
      });
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  @action
  didInsertCanvaslabel(canvas: HTMLCanvasElement) {
    this.labelCanvas = canvas;
  }

  @action
  switchHeatMapMode() {
    this.heatmapConfiguration.switchMode();
  }
}
