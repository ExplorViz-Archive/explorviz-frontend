import THREE from 'three';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';

export default class ApplicationGroup extends THREE.Group {
  openedApps: Map<string, ApplicationObject3D>;

  constructor() {
    super();
    this.openedApps = new Map();
  }

  addApplication(application: ApplicationObject3D) {
    if (!this.hasApplication(application.dataModel.pid)) {
      this.add(application);
      this.openedApps.set(application.dataModel.pid, application);
    }
  }

  getOpenedApps() {
    return this.openedApps.values();
  }

  getApplication(id: string) {
    return this.openedApps.get(id);
  }

  hasApplication(id: string) {
    return this.openedApps.has(id);
  }

  removeApplicationById(id: string) {
    const application = this.openedApps.get(id);
    if (application) this.removeApplication(application);
  }

  removeApplication(application: ApplicationObject3D) {
    this.openedApps.delete(application.dataModel.pid);
    if (application.parent) {
      application.parent.remove(application);
    }
    application.children.forEach((child) => {
      if (child instanceof BaseMesh) {
        child.disposeRecursively();
      }
    });
  }

  /**
   * Removes all applications.
   */
  clear() {
    Array.from(this.openedApps.values()).forEach((application) => this.removeApplication(application));
  }
}
