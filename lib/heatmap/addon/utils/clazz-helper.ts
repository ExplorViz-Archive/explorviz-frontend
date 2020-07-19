import Component from 'explorviz-frontend/models/component';
import Clazz from 'explorviz-frontend/models/clazz';

/**
 * Adds all clazzes of a component to the {@param clazzesArray}
 */
// eslint-disable-next-line import/prefer-default-export
export function getClazzList(component: Component, clazzesArray: Clazz[]) {
  const children = component.get('children');
  const clazzes = component.get('clazzes');

  children.forEach((child) => {
    getClazzList(child, clazzesArray);
  });

  clazzes.forEach((clazz) => {
    clazzesArray.push(clazz);
  });
}
