import simpleheat from 'simpleheat';

export interface Gradient {
  '0_00': string;
  '0_15': string;
  '0_25': string;
  '0_35': string;
  '0_45': string;
  '0_55': string;
  '0_65': string;
  '0_75': string;
  '0_85': string;
  '1_00': string;
}

export function getDefaultGradient(): Gradient {
  return {
    '0_00': 'rgb(0, 0, 255)',
    '0_15': 'rgb(0, 153, 255)',
    '0_25': 'rgb(0, 255, 255)',
    '0_35': 'rgb(0, 255, 100)',
    '0_45': 'rgb(0, 255, 0)',
    '0_55': 'rgb(175, 255, 0)',
    '0_65': 'rgb(255, 255, 0)',
    '0_75': 'rgb(255, 175, 0)',
    '0_85': 'rgb(255, 125, 0)',
    '1_00': 'rgb(255, 0, 0)',
  };
}

export function simpleHeatmap(maximumValue: number, canvas: HTMLCanvasElement, gradient: Gradient,
  heatmapRadius: number, blurRadius: number) {
  const simpleHeatMap = simpleheat(canvas);
  simpleHeatMap.radius(heatmapRadius, blurRadius);
  simpleHeatMap.max(maximumValue);
  simpleHeatMap.gradient(gradient);
  return simpleHeatMap;
}
