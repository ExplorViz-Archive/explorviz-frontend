import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import LandscapeObject3D from 'explorviz-frontend/view-objects/3d/landscape/landscape-object-3d';
import ApplicationGroup from 'virtual-reality/utils/view-objects/vr/application-group';

export default class ArSettings extends Service.extend({
  // anything which *must* be merged to prototype here
}) {
  landscapeObject: LandscapeObject3D | undefined;

  @tracked
  landscapeOpacity: number;

  applicationGroup: ApplicationGroup | undefined;

  @tracked
  applicationOpacity: number;

  constructor() {
    super(...arguments);

    this.landscapeOpacity = 0.9;
    this.applicationOpacity = 0.7;
  }

  setLandscapeOpacity(opacity: number) {
    this.landscapeOpacity = opacity;
    this.updateLandscapeOpacity();
  }

  updateLandscapeOpacity() {
    if (this.landscapeObject) {
      this.landscapeObject.setOpacity(this.landscapeOpacity);
    }
  }

  setApplicationOpacity(opacity: number) {
    this.applicationOpacity = opacity;
    this.updateApplicationOpacity();
  }

  updateApplicationOpacity() {
    if (this.applicationGroup) {
      this.applicationGroup.getAllApplications().forEach((applicationObject3D) => {
        applicationObject3D.setBoxMeshOpacity(this.applicationOpacity);
      });
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'ar-settings': ArSettings;
  }
}
