import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import VrApplicationRenderer from 'explorviz-frontend/services/vr-application-renderer';
import LandscapeObject3D from 'explorviz-frontend/view-objects/3d/landscape/landscape-object-3d';

export default class ArSettings extends Service.extend({
  // anything which *must* be merged to prototype here
}) {
  @service('vr-application-renderer')
  private vrApplicationRenderer!: VrApplicationRenderer;

  landscapeObject: LandscapeObject3D | undefined;

  @tracked
  landscapeOpacity: number;

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
    this.vrApplicationRenderer.getOpenApplications().forEach((applicationObject3D) => {
      applicationObject3D.setBoxMeshOpacity(this.applicationOpacity);
    });
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'ar-settings': ArSettings;
  }
}
