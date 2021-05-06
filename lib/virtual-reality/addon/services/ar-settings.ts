import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import VrApplicationRenderer from 'explorviz-frontend/services/vr-application-renderer';
import VrLandscapeRenderer from 'explorviz-frontend/services/vr-landscape-renderer';

export default class ArSettings extends Service.extend({
  // anything which *must* be merged to prototype here
}) {
  @service('vr-application-renderer')
  private vrApplicationRenderer!: VrApplicationRenderer;

  @service('vr-landscape-renderer')
  private vrLandscapeRenderer!: VrLandscapeRenderer;

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
    this.vrLandscapeRenderer.landscapeObject3D.setOpacity(this.landscapeOpacity);
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
