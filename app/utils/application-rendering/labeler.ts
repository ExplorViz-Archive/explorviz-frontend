import THREE from 'three';
import ClazzMesh from 'explorviz-frontend/view-objects/3d/application/clazz-mesh';
import ClazzLabelMesh from 'explorviz-frontend/view-objects/3d/application/clazz-label-mesh';
import ComponentMesh from 'explorviz-frontend/view-objects/3d/application/component-mesh';
import ComponentLabelMesh from 'explorviz-frontend/view-objects/3d/application/component-label-mesh';
import FoundationMesh from 'explorviz-frontend/view-objects/3d/application/foundation-mesh';

/**
 * Creates a label and adds it at a calculated position to the given
 * component or foundation mesh
 * 
 * @param boxMesh The mesh which shall be labeled
 * @param font Desired font of the text
 * @param color Desired color of the text
 */
export function addBoxTextLabel(boxMesh: ComponentMesh|FoundationMesh, font: THREE.Font, color: THREE.Color) {
  const labelMesh = new ComponentLabelMesh(boxMesh, font, color);

  boxMesh.labelMesh = labelMesh;
  boxMesh.add(labelMesh);

  positionBoxLabel(boxMesh)
}

/**
 * Positions label of a given component mesh. This function is standalone and not part
 * of addComponentTextLabel because the position of a component label needs to be adapted
 * every time a component is opened or closed.
 * 
 * @param boxMesh Mesh which is labeled
 */
export function positionBoxLabel(boxMesh: ComponentMesh|FoundationMesh) {
  const label = boxMesh.labelMesh;

  if (!label) { return; }

  label.geometry.center();

  // Set y-position just above the box of the parent mesh
  label.position.y = boxMesh.geometry.parameters.height / 2 + 0.01;

  // Align text with component parent
  label.rotation.x = -(Math.PI / 2);
  label.rotation.z = -(Math.PI / 2);

  // Foundation is labeled like an opened component
  if (boxMesh instanceof FoundationMesh || boxMesh.opened) {
    const OFFSET_BOTTOM = 1.5;

    // Position Label just above the bottom edge
    label.position.x = -boxMesh.geometry.parameters.width / 2 + OFFSET_BOTTOM / boxMesh.width;
  } else {
    label.position.x = 0;
  }
}

/**
 * Creates a label and adds it at a calculated position to the given clazz mesh
 * 
 * @param clazzMesh The mesh which shall be labeled
 * @param font Desired font of the text
 * @param color Desired color of the text
 */
export function addClazzTextLabel(clazzMesh: ClazzMesh, font: THREE.Font, color: THREE.Color) {
  const text = clazzMesh.dataModel.name;

  const labelMesh = new ClazzLabelMesh(font, text, color);
  clazzMesh.labelMesh = labelMesh;

  // Set label origin to center of clazz mesh
  labelMesh.geometry.center();
  // Set y-position just above the clazz mesh
  labelMesh.position.y = clazzMesh.geometry.parameters.height / 2 + 0.01;

  // Rotate text
  labelMesh.rotation.x = -(Math.PI / 2);
  labelMesh.rotation.z = -(Math.PI / 3);

  clazzMesh.add(labelMesh);
}