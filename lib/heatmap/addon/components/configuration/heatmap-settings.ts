import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import HeatmapRepository from 'heatmap/services/repos/heatmap-repository';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface Args {}

interface HeatmapMode {
  name: string;
  id: string;
}

export default class HeatmapSettings extends Component<Args> {
  @service('repos/heatmap-repository')
  heatmapRepo!: HeatmapRepository;

  heatmapModes: HeatmapMode[] = [
    { name: 'Aggregated Heatmap', id: 'aggregatedHeatmap' },
    { name: 'Windowed Heatmap', id: 'windowedHeatmap' },
  ];

  descriptions = {
    heatmapMode: 'Aggregated Heatmap: The values of previous heatmaps are aggregated and added to the'
      + ' current value. Windowed Heatmap: The metrics are shown as a difference to the previous heatmap.'
      + ' The windowsize can be configured in the backend.',
    visualizationMode: 'Use a heatmap visualized with simpleheat or an array based heatmap.',
    helperLines: 'Show the helper lines to determine which point on the heatmap belongs to which class.',
    shGradient: 'Configure the simple heat gradient. Use either rgb, hex or css-style format.',
    ahGradient: 'Configure the array heat gradient. Use either rgb, hex or css-style format.',
    opacityValue: 'Set the opacity of the package boxes. Choose a value between 0 and 1.',
    showLegendValues: 'Select wether the raw heatmap values or their abstractions should be shown as label.',
    heatmapRadius: 'The size of each color point.',
    blurRadius: 'The radius at which the colors blur together.',
  };

  @tracked
  selectedMode: HeatmapMode;

  @tracked
  showSimpleHeatSettings: boolean = false;

  @tracked
  showArrayHeatSettings: boolean = false;

  constructor(owner: any, args: Args) {
    super(owner, args);
    this.selectedMode = this.heatmapRepo.selectedMode === 'aggregatedHeatmap' ? this.heatmapModes[0] : this.heatmapModes[1];
  }

  @action
  setHeatmapMode(mapMode: HeatmapMode) {
    this.selectedMode = mapMode;
    this.heatmapRepo.set('selectedMode', mapMode.id);
  }

  @action
  toggleSimpleHeat() {
    this.heatmapRepo.toggleProperty('useSimpleHeat');
  }

  @action
  onHeatmapRadiusChange(heatmapRadiusNew: number) {
    this.heatmapRepo.set('heatmapRadius', heatmapRadiusNew);
  }

  @action
  onBlurRadiusChange(blurRadiusNew: number) {
    this.heatmapRepo.set('blurRadius', blurRadiusNew);
  }

  @action
  toggleLegendValues() {
    this.heatmapRepo.toggleProperty('showLegendValues');
  }

  @action
  toggleSimpleHeatSettings() {
    this.showSimpleHeatSettings = !this.showSimpleHeatSettings;
  }

  @action
  toggleArraySettings() {
    this.showArrayHeatSettings = !this.showArrayHeatSettings;
  }

  @action
  resetSimpleHeatGradient() {
    this.heatmapRepo.resetSimpleHeatGradient();
  }

  @action
  resetArrayHeatGradient() {
    this.heatmapRepo.resetArrayHeatGradient();
  }

  @action
  toggleHelperLines() {
    this.heatmapRepo.toggleProperty('useHelperLines');
  }
}
