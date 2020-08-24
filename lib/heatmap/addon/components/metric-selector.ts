import Component from '@glimmer/component';
import { Metric } from 'heatmap/services/repos/heatmap-repository';

interface Args {
  metrics: Metric[];
  updateMetric(metric: Metric): void;
  selectedMetric: Metric|null;
}

export default class MetricSelector extends Component<Args> {
}
