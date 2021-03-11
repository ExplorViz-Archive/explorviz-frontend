import Service from '@ember/service';

export interface Settings {
  visualization: {
    colors: {
      application: ApplicationColorsHexString;
      landscape: LandscapeColorsHexString;
    };
  };
}

export interface ApplicationColorsHexString {
  foundation: string;
  componentOdd: string;
  componentEven: string;
  clazz: string;
  highlightedEntity: string;
  componentText: string;
  clazzText: string;
  foundationText: string;
  communication: string;
  communicationArrow: string;
  background: string;
}

export interface LandscapeColorsHexString {
  node: string;
  application: string;
  communication: string;
  nodeText: string;
  applicationText: string;
  collapseSymbol: string;
  background: string;
}

const defaultApplicationColors: ApplicationColorsHexString = {
  foundation: '#c7c7c7', // grey
  componentOdd: '#169e2b', // dark green
  componentEven: '#00bb41', // light green
  clazz: '#3e14a0', // purple-blue
  highlightedEntity: '#ff0000', // red
  componentText: '#ffffff', // white
  clazzText: '#ffffff', // white
  foundationText: '#000000', // black
  communication: '#f49100', // orange
  communicationArrow: '#000000', // black
  background: '#ffffff', // white
};

const defaultLandscapeColors: LandscapeColorsHexString = {
  node: '#00bb41', // green
  application: '#3e14a0', // purple-blue
  communication: '#f49100', // orange
  nodeText: '#ffffff', // white
  applicationText: '#ffffff', // white
  collapseSymbol: '#000000', // black
  background: '#ffffff', // white
};

const visuallyImpairedApplicationColors = {
  foundation: '#c7c7c7', // grey
  componentOdd: '#015a6e', // blue
  componentEven: '#0096be', // light blue
  clazz: '#5f5f5f', // dark grey
  highlightedEntity: '#ff0000', // red
  componentText: '#ffffff', // white
  clazzText: '#ffffff', // white
  foundationText: '#000000', // black
  communication: '#f49100', // orange
  communicationArrow: '#000000', // black
  background: '#ffffff', // white
};

const visuallyImpairedLandscapeColors = {
  node: '#0096be', // green
  application: '#5f5f5f', // purple-blue
  communication: '#f49100', // orange
  nodeText: '#ffffff', // white
  applicationText: '#ffffff', // white
  collapseSymbol: '#000000', // black
  background: '#ffffff', // white
};

export default class UserSettings extends Service {
  settings!: Settings;

  init() {
    super.init();
    try {
      this.restoreSettings();
    } catch (e) {
      this.applyDefaultSettings();
    }
  }

  private restoreSettings() {
    const userSettingsJSON = localStorage.getItem('userSettings');

    if (userSettingsJSON === null) {
      throw new Error('There are no settings to restore');
    }

    const parsedSettings = JSON.parse(userSettingsJSON);

    if (this.areValidSettings(parsedSettings)) {
      this.set('settings', parsedSettings);
    } else {
      throw new Error('The settings are invalid');
    }
  }

  applyDefaultSettings() {
    const settings = {
      visualization: {
        colors: {
          application: { ...defaultApplicationColors },
          landscape: { ...defaultLandscapeColors },
        },
      },
    };

    this.updateSettings(settings);
  }

  updateSettings(settings: Settings) {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    this.set('settings', settings);
  }

  updateLandscapeColor(attribute: keyof LandscapeColorsHexString, value: string) {
    this.settings.visualization.colors.landscape[attribute] = value;
    this.updateSettings(this.settings);
  }

  updateApplicationColor(attribute: keyof ApplicationColorsHexString, value: string) {
    this.settings.visualization.colors.application[attribute] = value;
    this.updateSettings(this.settings);
  }

  applyDefaultColorsForLandscape() {
    this.settings.visualization.colors.landscape = { ...defaultLandscapeColors };
    this.updateSettings(this.settings);
  }

  applyDefaultColorsForApplication() {
    this.settings.visualization.colors.application = { ...defaultApplicationColors };
    this.updateSettings(this.settings);
  }

  applyVisuallyImpairedColorsForLandscape() {
    this.settings.visualization.colors.landscape = { ...visuallyImpairedLandscapeColors };
    this.updateSettings(this.settings);
  }

  applyVisuallyImpairedColorsForApplication() {
    this.settings.visualization.colors.application = { ...visuallyImpairedApplicationColors };
    this.updateSettings(this.settings);
  }

  // eslint-disable-next-line class-methods-use-this
  private areValidSettings(settings: unknown): settings is Settings {
    // TODO: implement checks for properties to exist and types to be correct
    return true;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'user-settings': UserSettings;
  }
}
