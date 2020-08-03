import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';

export function getDefaultGradient() {
  return {
    '-0_35': 'rgb(0, 0, 255)',
    '-0_25': 'rgb(0, 255, 255)',
    '-0_15': 'rgb(0, 255, 100)',
    '-0_05': 'rgb(209, 255, 227)',
    '0_05': 'rgb(255, 255, 255)',
    '0_15': 'rgb(255, 255, 0)',
    '0_25': 'rgb(255, 162, 0)',
    '0_35': 'rgb(255, 98, 0)',
    '0_50+': 'rgb(255, 0, 0)',
  };
}

export function setColorValues(index: number, heatValue: number, colorMap: number[],
  foundationMesh: FoundationMesh) {
  const { depthSegments, widthSegments } = foundationMesh.geometry.parameters;

  // Compute face numbers of top side of the cube
  const size = widthSegments * depthSegments * 2;

  let evenIndex;
  const secondaryScalar = 0.4;
  const tertiaryScalar = 0.2;

  if (index % 2 === 0) {
    evenIndex = index;
  } else {
    evenIndex = index - 1;
  }
  colorMap[evenIndex] += heatValue;
  colorMap[evenIndex + 1] += heatValue;

  // TODO: compute bounds

  // secondary colors
  const nIndex = evenIndex + 2;
  if (nIndex < size) {
    colorMap[nIndex] += heatValue * secondaryScalar;
    colorMap[nIndex + 1] += heatValue * secondaryScalar;
  }

  const sIndex = evenIndex - 2;
  if (sIndex < size) {
    colorMap[sIndex] += heatValue * secondaryScalar;
    colorMap[sIndex + 1] += heatValue * secondaryScalar;
  }

  const wIndex = evenIndex - widthSegments * 2;
  if (wIndex < size) {
    colorMap[wIndex] += heatValue * secondaryScalar;
    colorMap[wIndex + 1] += heatValue * secondaryScalar;
  }

  const eIndex = evenIndex + widthSegments * 2;
  if (eIndex < size) {
    colorMap[eIndex] += heatValue * secondaryScalar;
    colorMap[eIndex + 1] += heatValue * secondaryScalar;
  }

  // tertiary colors
  const neIndex = eIndex + 2;
  if (neIndex < size) {
    colorMap[neIndex] += heatValue * tertiaryScalar;
    colorMap[neIndex + 1] += heatValue * tertiaryScalar;
  }

  const seIndex = eIndex - 2;
  if (seIndex < size) {
    colorMap[seIndex] += heatValue * tertiaryScalar;
    colorMap[seIndex + 1] += heatValue * tertiaryScalar;
  }

  const swIndex = wIndex + 2;
  if (swIndex < size) {
    colorMap[swIndex] += heatValue * tertiaryScalar;
    colorMap[swIndex + 1] += heatValue * tertiaryScalar;
  }

  const nwIndex = wIndex - 2;
  if (nwIndex < size) {
    colorMap[nwIndex] += heatValue * tertiaryScalar;
    colorMap[nwIndex + 1] += heatValue * tertiaryScalar;
  }
}

export function computeGradient(requestedValue: number, maximumValue: number, gradient: Gradient) {
  let val = '';
  let gradientValue = 0;
  if (maximumValue > 0) {
    gradientValue = requestedValue / maximumValue;
  }

  if (gradientValue <= -0.35) { // -* - -35
    val = gradient['-0.35'];
  } else if (gradientValue <= -0.25) { // -34 - -25
    val = gradient['-0.25'];
  } else if (gradientValue <= -0.15) { // -26 - -15
    val = gradient['-0.15'];
  } else if (gradientValue <= -0.05) { // -14 - -5
    val = gradient['-0.05'];
  } else if (gradientValue <= 0.05) { // -6 - 5
    val = gradient['0.05'];
  } else if (gradientValue <= 0.15) { // 6 - 15
    val = gradient['0.15'];
  } else if (gradientValue <= 0.25) { // 14 - 25
    val = gradient['0.25'];
  } else if (gradientValue <= 0.35) { // 26 - 35
    val = gradient['0.35'];
  } else { // 36 - *
    val = gradient['0.50'];
  }

  return val;
}

/**
   * Apply the values specified in the colorMap to the surface of the foundation Mesh
   *
   * @param {Number[]} colorMap
   * @param {*} foundationMesh
   * @param {Number} maximumValue
   */
export function invokeRecoloring(colorMap: number[], foundationMesh: FoundationMesh,
  maximumValue: number, gradient: Gradient) {
  const { depthSegments, widthSegments } = foundationMesh.geometry.parameters;

  // The number of faces at front and back of the foundation mesh,
  // i.e. the starting index for the faces on top.
  const depthOffset = depthSegments * 4;
  // Compute face numbers of top side of the cube
  const size = widthSegments * depthSegments * 2;
  for (let i = 0; i < size; i += 1) {
    if (colorMap[i]) {
      const color = computeGradient(colorMap[i], maximumValue, gradient);
      foundationMesh.geometry.faces[i + depthOffset].color.set(color);
    }
  }

  foundationMesh.geometry.colorsNeedUpdate = true;
}

export type Gradient = {
  [value: string]: string
};
