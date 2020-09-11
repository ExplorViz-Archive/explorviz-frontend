import THREE from 'three';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';

export default class ApplicationGroup extends THREE.Group {
  openedApps: Map<string, ApplicationObject3D>;

  constructor() {
    super();
    this.openedApps = new Map();
  }

  addApplication(application: ApplicationObject3D) {
    if (!this.hasApplication(application.dataModel.id)) {
      this.add(application);
      this.openedApps.set(application.dataModel.id, application);
    }
  }

  hasApplication(id: string) {
    return this.openedApps.has(id);
  }

  removeApplicationById(id: string) {
    const application = this.openedApps.get(id);
    if (application) {
      this.openedApps.delete(id);
      this.remove(application);
    }
  }

  /**
   * Removes all applications.
   */
  clear() {
    Array.from(this.openedApps.values()).forEach((application) => {
      this.remove(application);
    });

    this.openedApps.clear();
  }
}
