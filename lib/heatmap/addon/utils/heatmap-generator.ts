import { Gradient } from './array-heatmap';

// Compute the min and max values for the heatmap.
export function computeHeatmapMinMax(map: Map<any, number>) {
  const min = Math.min(...map.values());
  const max = Math.max(...map.values());
  return { min, max };
}

export function revertKey(gradient: Gradient) {
  const replacedItems = Object.keys(gradient).map((key) => ({ [key.replace(/_/g, '.').replace(/\+/g, '')]: gradient[key] }));
  return Object.assign({}, ...replacedItems);
}
