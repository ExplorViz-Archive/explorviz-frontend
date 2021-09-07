import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import {
  classicApplicationColors, classicLandscapeColors, ColorScheme,
  darkApplicationColors, darkLandscapeColors, defaultApplicationColors,
  defaultLandscapeColors, visuallyImpairedApplicationColors,
  visuallyImpairedLandscapeColors,
} from 'explorviz-frontend/utils/settings/color-schemes';
import {
  defaultApplicationSettings, defaultLanscapeSettings,
} from 'explorviz-frontend/utils/settings/default-settings';
import {
  ApplicationColorSettings, ApplicationSettingId,
  ApplicationSettings, isColorSetting, isFlagSetting,
  isRangeSetting, LandscapeColorSettings,
  LandscapeSettingId, LandscapeSettings, RangeSetting,
} from 'explorviz-frontend/utils/settings/settings-schemas';

export default class UserSettings extends Service {
  @tracked
  landscapeSettings!: LandscapeSettings;

  @tracked
  applicationSettings!: ApplicationSettings;

  constructor() {
    super(...arguments);

    try {
      this.restoreSettings();
    } catch (e) {
      this.applyDefaultSettings();
    }
  }

  private restoreSettings() {
    const userLandscapeSettingsJSON = localStorage.getItem('userLandscapeSettings');
    const userApplicationSettingsJSON = localStorage.getItem('userApplicationSettings');

    if (userLandscapeSettingsJSON === null || userApplicationSettingsJSON === null) {
      throw new Error('There are no settings to restore');
    }

    const parsedLandscapeSettings = JSON.parse(userLandscapeSettingsJSON);
    const parsedApplicationSettings = JSON.parse(userApplicationSettingsJSON);

    this.set('landscapeSettings', parsedLandscapeSettings);
    this.set('applicationSettings', parsedApplicationSettings);
  }

  applyDefaultSettings() {
    this.set('landscapeSettings', JSON.parse(JSON.stringify(defaultLanscapeSettings)));
    this.set('applicationSettings', JSON.parse(JSON.stringify(defaultApplicationSettings)));
  }

  updateSettings() {
    localStorage.setItem('userLandscapeSettings', JSON.stringify(this.landscapeSettings));
    localStorage.setItem('userApplicationSettings', JSON.stringify(this.applicationSettings));
  }

  updateApplicationSetting(name: ApplicationSettingId, value: unknown) {
    // eslint-disable-next-line
    const setting = this.applicationSettings[name];

    if (isRangeSetting(setting) && typeof value === 'number') {
      this.validateRangeSetting(setting, value);
      this.applicationSettings = {
        ...this.applicationSettings,
        [name]: { ...JSON.parse(JSON.stringify(setting)), value },
      };
      this.updateSettings();
    } else if (isFlagSetting(setting) && typeof value === 'boolean') {
      this.applicationSettings = {
        ...this.applicationSettings,
        [name]: { ...JSON.parse(JSON.stringify(setting)), value },
      };
      this.updateSettings();
    } else if (isColorSetting(setting) && typeof value === 'string') {
      /*       const regExHex = /^#(?:[0-9a-f]{3}){1,2}$/i; */
      setting.value = value;
      this.updateSettings();
    }
  }

  updateLandscapeSetting(name: LandscapeSettingId, value: unknown) {
    // eslint-disable-next-line
    const setting = this.landscapeSettings[name];

    if (isRangeSetting(setting) && typeof value === 'number') {
      this.validateRangeSetting(setting, value);
      this.landscapeSettings = {
        ...this.landscapeSettings,
        [name]: { ...JSON.parse(JSON.stringify(setting)), value },
      };
      this.updateSettings();
    } else if (isFlagSetting(setting) && typeof value === 'boolean') {
      this.landscapeSettings = {
        ...this.landscapeSettings,
        [name]: { ...JSON.parse(JSON.stringify(setting)), value },
      };
      this.updateSettings();
    } else if (isColorSetting(setting) && typeof value === 'string') {
      /*       const regExHex = /^#(?:[0-9a-f]{3}){1,2}$/i; */
      setting.value = value;
      this.updateSettings();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private validateRangeSetting(rangeSetting: RangeSetting, value: number) {
    const { range } = rangeSetting;
    if (Number.isNaN(value)) {
      throw new Error('Value is not a number');
    } else if (value < range.min || value > range.max) {
      throw new Error(`Value must be between ${range.min} and ${range.max}`);
    }
  }

  setColorScheme(scheme: ColorScheme) {
    let applicationColors = defaultApplicationColors;
    let landscapeColors = defaultLandscapeColors;

    if (scheme === 'classic') {
      applicationColors = classicApplicationColors;
      landscapeColors = classicLandscapeColors;
    } else if (scheme === 'dark') {
      applicationColors = darkApplicationColors;
      landscapeColors = darkLandscapeColors;
    } else if (scheme === 'impaired') {
      applicationColors = visuallyImpairedApplicationColors;
      landscapeColors = visuallyImpairedLandscapeColors;
    }

    let settingId: keyof LandscapeColorSettings;
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (settingId in landscapeColors) {
      const setting = this.landscapeSettings[settingId];
      setting.value = landscapeColors[settingId];
    }

    let settingId2: keyof ApplicationColorSettings;
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (settingId2 in applicationColors) {
      const setting = this.applicationSettings[settingId2];
      setting.value = applicationColors[settingId2];
    }

    this.updateSettings();
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'user-settings': UserSettings;
  }
}
