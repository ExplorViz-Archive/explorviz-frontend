import Service, { inject as service } from '@ember/service';
import THREE from 'three';
import { tracked } from '@glimmer/tracking';
import UserSettings from './user-settings';

export type LandscapeColors = {
  node: THREE.Color,
  application: THREE.Color,
  communication: THREE.Color,
  nodeText: THREE.Color,
  applicationText: THREE.Color,
  background: THREE.Color
};

export type ApplicationColors = {
  foundation: THREE.Color,
  componentOdd: THREE.Color,
  componentEven: THREE.Color,
  clazz: THREE.Color,
  highlightedEntity: THREE.Color,
  componentText: THREE.Color,
  clazzText: THREE.Color,
  foundationText: THREE.Color,
  communication: THREE.Color,
  communicationArrow: THREE.Color,
  background: THREE.Color
};

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

    const {
      application: applicationSettings,
      landscape: landscapeSettings,
    } = this.userSettings.settings.colors;

    this.landscapeColors = {
      node: new THREE.Color(landscapeSettings.node),
      application: new THREE.Color(landscapeSettings.application),
      communication: new THREE.Color(landscapeSettings.communication),
      nodeText: new THREE.Color(landscapeSettings.nodeText),
      applicationText: new THREE.Color(landscapeSettings.applicationText),
      background: new THREE.Color(landscapeSettings.background),
    };

    this.applicationColors = {
      foundation: new THREE.Color(applicationSettings.foundation),
      componentOdd: new THREE.Color(applicationSettings.componentOdd),
      componentEven: new THREE.Color(applicationSettings.componentEven),
      clazz: new THREE.Color(applicationSettings.clazz),
      highlightedEntity: new THREE.Color(applicationSettings.highlightedEntity),
      componentText: new THREE.Color(applicationSettings.componentText),
      clazzText: new THREE.Color(applicationSettings.clazzText),
      foundationText: new THREE.Color(applicationSettings.foundationText),
      communication: new THREE.Color(applicationSettings.communication),
      communicationArrow: new THREE.Color(applicationSettings.communicationArrow),
      background: new THREE.Color(applicationSettings.background),
    };
  }
}

declare module '@ember/service' {
  interface Registry {
    'configuration': Configuration;
  }
}
