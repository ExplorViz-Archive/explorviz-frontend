import Component from '@glimmer/component';
import debugLogger from 'ember-debug-logger';
import HeatmapConfiguration from 'heatmap/services/heatmap-configuration';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

interface Args {
  descriptions?: {
    aggregatedHeatmap: string,
    windowedHeatmap: string
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
      aggregatedHeatmap: 'Aggregates subsequent heatmaps by adding a part of the previous metric score to the new value.',
      windowedHeatmap: 'Compares the latest metric score by difference to a previous one. The heatmap to be compared to is defined by the windowsize in the backend.',
    };
  }

  get subHeader() {
    const { mode } = this.heatmapConfiguration.selectedMetric!;
    if (mode === 'aggregatedHeatmap') {
      return 'Aggregated score:';
    }
    if (mode === 'windowedHeatmap') {
      return 'Value difference:';
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
  didInsertLegendlabel(div: HTMLDivElement) {
    this.labelCanvas.width = div.clientWidth;
    this.labelCanvas.height = div.clientHeight;

    this.updateLabel();
  }

  @action
  updateLabel() {
    const canvas = this.labelCanvas;
    const ctx = canvas.getContext('2d')!;

    let minLabel = 'min';
    let midLabel = 'mid';
    let maxLabel = 'max';

    if (this.heatmapConfiguration.showLegendValues) {
      const largestValue = Math.ceil(this.heatmapConfiguration.selectedMetric!.max);

      if (this.heatmapConfiguration.selectedMode === 'aggregatedHeatmap') {
        minLabel = '0';
        midLabel = `${largestValue / 2}`;
        maxLabel = `${largestValue}`;
      } else {
        minLabel = `${-largestValue / 2}`;
        midLabel = '0';
        maxLabel = `${largestValue / 2}`;
      }
    } else if (this.heatmapConfiguration.selectedMode === 'aggregatedHeatmap') {
      minLabel = '0';
    } else {
      midLabel = '0';
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '1rem Arial';
    ctx.textAlign = 'center';
    ctx.fillText(maxLabel, canvas.width / 2, canvas.height * 0.05);
    ctx.fillText(midLabel, canvas.width / 2, canvas.height * 0.525);
    ctx.fillText(minLabel, canvas.width / 2, canvas.height * 0.99);
  }
}
