import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';
import debugLogger from 'ember-debug-logger';
import DS from 'ember-data';
import { set } from '@ember/object';
import Timestamp from 'explorviz-frontend/models/timestamp';
import { AjaxServiceClass } from 'ember-ajax/services/ajax';
import LandscapeRepository from './repos/landscape-repository';
import TimestampRepository from './repos/timestamp-repository';

declare const EventSourcePolyfill: any;

function isObject(obj: any): obj is object {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

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
  packages: Package[];
}

export interface Node {
  ipAddress: string;
  hostName: string;
  applications: Application[];
}

export interface Landscape {
  landscapeToken: string;
  nodes: Node[];
}

export function isLandscape(x: any): x is Landscape {
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

export default class LandscapeListener extends Service.extend(Evented) {
  // https://github.com/segmentio/sse/blob/master/index.js

  content: any = null;

  @service('session') session!: any;

  @service('store') store!: DS.Store;

  @service('repos/timestamp-repository') timestampRepo!: TimestampRepository;

  @service('repos/landscape-repository') landscapeRepo!: LandscapeRepository;

  @service('ajax') ajax!: AjaxServiceClass;

  latestJsonLandscape: Landscape|null = null;

  es: any = null;

  pauseVisualizationReload = false;

  debug = debugLogger();

  initSSE() {
    set(this, 'content', []);

    const self = this;

    // eslint-disable-next-line @typescript-eslint/camelcase
    // const { access_token } = this.session.data.authenticated;

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

    function fulfill(landscapeStructure: Landscape) {
      set(self, 'latestJsonLandscape', landscapeStructure);
      landscapeStructure.nodes.forEach((node) => {
        node.applications.forEach((app) => {
          app.packages.forEach((component) => {
            component.id = component.name;
            component.subPackages.forEach((subComponent) => {
              createPackageIds(subComponent, component.id);
              addParentToPackage(subComponent, component);
            });
            addParentToClazzes(component);
          });
          createClassIds(app.packages);
        });
      });
      self.landscapeRepo.triggerLatestLandscapeUpdate();
    }

    function failure(reason: any) {
      console.log(reason);
    }

    this.ajax.request('http://localhost:32680/v2/landscapes/fibonacci-sample-landscape/structure').then(fulfill, failure);
  }

  updateTimestampRepoAndTimeline(this: LandscapeListener, timestamp: Timestamp) {
    set(this.timestampRepo, 'latestTimestamp', timestamp);

    // this syntax will notify the template engine to redraw all components
    // with a binding to this attribute
    set(this.timestampRepo, 'timelineTimestamps', [...this.timestampRepo.timelineTimestamps, timestamp]);

    this.timestampRepo.triggerTimelineUpdate();
  }

  toggleVisualizationReload() {
    // TODO: need to notify the timeline
    if (this.pauseVisualizationReload) {
      this.startVisualizationReload();
    } else {
      this.stopVisualizationReload();
    }
  }

  startVisualizationReload() {
    set(this, 'pauseVisualizationReload', false);
    this.trigger('visualizationResumed');
  }

  stopVisualizationReload() {
    set(this, 'pauseVisualizationReload', true);
  }
}

declare module '@ember/service' {
  interface Registry {
    'landscape-listener': LandscapeListener;
  }
}
