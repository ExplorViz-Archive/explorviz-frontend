import isObject from '../object-helpers';

export interface Method {
  name: string;
  hashCode: string;
}

export interface Class {
  id: string;
  name: string;
  methods: Method[];
  parent: Package;
}

export interface Package {
  id: string;
  name: string;
  subPackages: Package[];
  classes: Class[];
  parent?: Package;
}

export interface Application {
  name: string;
  language: string;
  pid: string;
  parent: Node;
  packages: Package[];
}

export interface Node {
  ipAddress: string;
  hostName: string;
  applications: Application[];
}

export interface StructureLandscapeData {
  landscapeToken: string;
  nodes: Node[];
}

export function isLandscape(x: any): x is StructureLandscapeData {
  return isObject(x) && Object.prototype.hasOwnProperty.call(x, 'nodes');
}

export function isNode(x: any): x is Node {
  return isObject(x) && Object.prototype.hasOwnProperty.call(x, 'applications');
}

export function isApplication(x: any): x is Application {
  return isObject(x) && Object.prototype.hasOwnProperty.call(x, 'packages');
}

export function isPackage(x: any): x is Package {
  return isObject(x) && Object.prototype.hasOwnProperty.call(x, 'classes');
}

export function isClass(x: any): x is Class {
  return isObject(x) && Object.prototype.hasOwnProperty.call(x, 'methods');
}

export function isMethod(x: any): x is Method {
  return isObject(x) && Object.prototype.hasOwnProperty.call(x, 'hashCode');
}

export function preProcessAndEnhanceStructureLandscape(
  landscapeStructure: RawStructureLandscapeData,
) {
  function createPackageIds(component: Package, parentId: string) {
    component.id = `${parentId}.${component.name}`;
    component.subPackages.forEach((subComponent) => {
      createPackageIds(subComponent, component.id);
    });
  }

  function createClassIds(components: Package[]) {
    components.forEach((component) => {
      component.classes.forEach((clazz) => {
        clazz.id = `${component.id}.${clazz.name}`;
      });
      createClassIds(component.subPackages);
    });
  }

  function addParentToPackage(child: Package, parent: Package) {
    child.parent = parent;
    child.subPackages.forEach((subChild) => addParentToPackage(subChild, child));
  }

  function addParentToClazzes(component: Package) {
    component.classes.forEach((clazz) => {
      clazz.parent = component;
    });
    component.subPackages.forEach((subPackage) => {
      addParentToClazzes(subPackage);
    });
  }

  function addParentToApplication(app: Application, parent: Node) {
    app.parent = parent;
  }

  const enhancedlandscapeStructure: StructureLandscapeData = JSON.parse(
    JSON.stringify(landscapeStructure),
  );

  enhancedlandscapeStructure.nodes.forEach((node) => {
    node.applications.forEach((app) => {
      app.packages.forEach((component) => {
        // create package ids in Java notation, e.g., 'net.explorviz.test'
        // and add parent relations for quicker access
        component.id = component.name;
        component.subPackages.forEach((subComponent) => {
          createPackageIds(subComponent, component.id);
          addParentToPackage(subComponent, component);
        });
        addParentToClazzes(component);
      });
      createClassIds(app.packages);
      addParentToApplication(app, node);
    });
  });

  return enhancedlandscapeStructure;
}

interface RawMethod {
  name: string;
  hashCode: string;
}

interface RawClass {
  name: string;
  methods: RawMethod[];
}

interface RawPackage {
  name: string;
  subPackages: RawPackage[];
  classes: RawClass[];
}

interface RawApplication {
  name: string;
  language: string;
  pid: string;
  packages: RawPackage[];
}

interface RawNode {
  ipAddress: string;
  hostName: string;
  applications: RawApplication[];
}

export interface RawStructureLandscapeData {
  landscapeToken: string;
  nodes: RawNode[];
}
