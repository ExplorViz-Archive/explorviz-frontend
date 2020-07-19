import Clazz from 'explorviz-frontend/models/clazz';
import { Gradient } from './array-heatmap';

// Generate dummy values for a given class list
export function computeDummyHeatmap(clazzList: Clazz[]) {
  const heatmap = new Map();

  clazzList.forEach((clazz) => {
    heatmap.set(clazz.fullQualifiedName, Math.floor(Math.random() * 100) - 50);
  });

  return heatmap;
}

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
