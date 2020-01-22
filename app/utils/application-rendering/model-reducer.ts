import Application from 'explorviz-frontend/models/application';
import Component from 'explorviz-frontend/models/component';
import Clazz from 'explorviz-frontend/models/clazz';

export function reduceApplication(application: Application) : ReducedApplication {
  let childComponents = application.get('components').toArray();
  let reducedComponents = childComponents.map(child => reduceComponent(child));
  return {
    id: application.get('id'),
    components: reducedComponents
  }
}

export function reduceComponent(component: Component) : ReducedComponent {
  let childComponents = component.get('children').toArray();
  let clazzes = component.get('clazzes').toArray();

  let reducedClazzes = clazzes.map(clazz => reduceClazz(clazz));
  let reducedComponents = childComponents.map(child => reduceComponent(child));

  return {
    id: component.get('id'),
    name: component.get('name'),
    clazzes: reducedClazzes,
    children: reducedComponents
  }
}

export function reduceClazz(clazz: Clazz) : ReducedClazz {
  return {
    id: clazz.get('id'),
    name: clazz.get('name'),
    instanceCount: clazz.get('instanceCount')
  }
}

export type ReducedClazz = {
  id: string,
  name: string,
  instanceCount: number
}

export type ReducedComponent = {
  id: string,
  name: string,
  clazzes: ReducedClazz[],
  children: ReducedComponent[]
}

export type ReducedApplication = {
  id: string,
  components: ReducedComponent[]
}