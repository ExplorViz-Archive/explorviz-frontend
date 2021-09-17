import Service, { inject as service } from '@ember/service';
import THREE from 'three';
import { tracked } from '@glimmer/tracking';
import { ApplicationColorSettingId, LandscapeColorSettingId } from 'explorviz-frontend/utils/settings/settings-schemas';
import UserSettings from './user-settings';

export type LandscapeColors = Record<LandscapeColorSettingId, THREE.Color>;

export type ApplicationColors = Record<ApplicationColorSettingId, THREE.Color>;

/**
 * The Configuration Service handles color settings for the
 * visualization and configuration extensions
 * @class Configuration-Service
 * @extends Ember.Service
 */
export default class Configuration extends Service {
  @service('user-settings')
  userSettings!: UserSettings;

  /**
  * Colors for landscape visualization
  *
  * @property landscapeColors
  * @type LandscapeColors
  */
  @tracked
  landscapeColors!: LandscapeColors;

  /**
  * Colors for application visualization
  *
  * @property applicationColors
  * @type ApplicationColors
  */
  @tracked
  applicationColors!: ApplicationColors;

  // #region APPLICATION LAYOUT

  commCurveHeightDependsOnDistance = true;

  // #endregion APPLICATION LAYOUT

  /**
   * Sets default colors
   */
  constructor() {
    super(...arguments);

    const { landscapeSettings, applicationSettings } = this.userSettings;

    this.landscapeColors = {
      nodeColor: new THREE.Color(landscapeSettings.nodeColor.value),
      applicationColor: new THREE.Color(landscapeSettings.applicationColor.value),
      communicationColor: new THREE.Color(landscapeSettings.communicationColor.value),
      nodeTextColor: new THREE.Color(landscapeSettings.nodeTextColor.value),
      applicationTextColor: new THREE.Color(landscapeSettings.applicationTextColor.value),
      backgroundColor: new THREE.Color(landscapeSettings.backgroundColor.value),
    };

    this.applicationColors = {
      foundationColor: new THREE.Color(applicationSettings.foundationColor.value),
      componentOddColor: new THREE.Color(applicationSettings.componentOddColor.value),
      componentEvenColor: new THREE.Color(applicationSettings.componentEvenColor.value),
      clazzColor: new THREE.Color(applicationSettings.clazzColor.value),
      highlightedEntityColor:
      new THREE.Color(applicationSettings.highlightedEntityColor.value),
      componentTextColor: new THREE.Color(applicationSettings.componentTextColor.value),
      clazzTextColor: new THREE.Color(applicationSettings.clazzTextColor.value),
      foundationTextColor: new THREE.Color(applicationSettings.foundationTextColor.value),
      communicationColor: new THREE.Color(applicationSettings.communicationColor.value),
      communicationArrowColor:
      new THREE.Color(applicationSettings.communicationArrowColor.value),
      backgroundColor: new THREE.Color(applicationSettings.backgroundColor.value),
    };
  }
}

declare module '@ember/service' {
  interface Registry {
    'configuration': Configuration;
  }
}
