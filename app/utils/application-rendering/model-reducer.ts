import Application from 'explorviz-frontend/models/application';
import Component from 'explorviz-frontend/models/component';
import Clazz from 'explorviz-frontend/models/clazz';

function reduceClazz(clazz: Clazz): ReducedClazz {
  return {
    id: clazz.get('id'),
    name: clazz.get('name'),
    instanceCount: clazz.get('instanceCount'),
  };
}

function reduceComponent(component: Component): ReducedComponent {
  const childComponents = component.get('children').toArray();
  const clazzes = component.get('clazzes').toArray();

  const reducedClazzes = clazzes.map((clazz) => reduceClazz(clazz));
  const reducedComponents = childComponents.map((child) => reduceComponent(child));

  return {
    id: component.get('id'),
    name: component.get('name'),
    clazzes: reducedClazzes,
    children: reducedComponents,
  };
}

/**
 * Takes and application and reduces it to simple a simple JS object,
 * containing only the data and structure necessary for the city-layouter
 *
 * @param application The Application to reduce
 */
export default function reduceApplication(application: Application): ReducedApplication {
  const childComponents = application.get('components').toArray();
  const reducedComponents = childComponents.map((child) => reduceComponent(child));
  return {
    id: application.get('id'),
    components: reducedComponents,
  };
}

export type ReducedClazz = {
  id: string,
  name: string,
  instanceCount: number
};

export type ReducedComponent = {
  id: string,
  name: string,
  clazzes: ReducedClazz[],
  children: ReducedComponent[]
};

export type ReducedApplication = {
  id: string,
  components: ReducedComponent[]
};
