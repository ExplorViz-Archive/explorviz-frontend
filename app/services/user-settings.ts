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
  background: string;
}

const defaultApplicationColors: ApplicationColorsHexString = {
  foundation: '#d2d2d2', // grey
  componentOdd: '#65c97e', // lime green
  componentEven: '#3c8db0', // desaturated cyan
  clazz: '#a7cffb', // light pastel blue
  highlightedEntity: '#ff5151', // pastel red
  componentText: '#ffffff', // white
  clazzText: '#ffffff', // white
  foundationText: '#000000', // black
  communication: '#d6d48b', // dark grey
  communicationArrow: '#000000', // black
  background: '#ffffff', // white
};

const defaultLandscapeColors: LandscapeColorsHexString = {
  node: '#6bc484', // washed-out green
  application: '#0096be', // sky blue
  communication: '#d6d48b', // washed-out yellow
  nodeText: '#ffffff', // white
  applicationText: '#ffffff', // white
  background: '#ffffff', // white
};

const classicApplicationColors = {
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

const classicLandscapeColors = {
  node: '#00bb41', // green
  application: '#3e14a0', // purple-blue
  communication: '#f49100', // orange
  nodeText: '#ffffff', // white
  applicationText: '#ffffff', // white
  background: '#ffffff', // white
};

const visuallyImpairedApplicationColors = {
  foundation: '#c7c7c7', // light grey
  componentOdd: '#015a6e', // deep teal
  componentEven: '#0096be', // light blue
  clazz: '#f7f7f7', // white
  highlightedEntity: '#ff0000', // red
  componentText: '#ffffff', // white
  clazzText: '#ffffff', // white
  foundationText: '#000000', // black
  communication: '#f49100', // orange
  communicationArrow: '#000000', // black
  background: '#ffffff', // white
};

const visuallyImpairedLandscapeColors = {
  node: '#0096be', // sky blue
  application: '#5f5f5f', // grey
  communication: '#f49100', // orange
  nodeText: '#ffffff', // white
  applicationText: '#ffffff', // white
  background: '#ffffff', // white
};

const darkApplicationColors = {
  foundation: '#c7c7c7', // grey
  componentOdd: '#2f3d3b', // dark grey
  componentEven: '#5B7B88', // blue-grey
  clazz: '#4073b6', // blue
  highlightedEntity: '#ff0000', // red
  componentText: '#ffffff', // white
  clazzText: '#ffffff', // white
  foundationText: '#000000', // black
  communication: '#e3e3e3', // light grey
  communicationArrow: '#000000', // black
  background: '#acacac', // stone grey
};

const darkLandscapeColors = {
  node: '#2f3d3b', // light black
  application: '#5B7B88', // blue-grey
  communication: '#e3e3e3', // light grey
  nodeText: '#ffffff', // white
  applicationText: '#ffffff', // white
  background: '#acacac', // stone grey
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

  setDefaultColors() {
    this.settings.visualization.colors.landscape = { ...defaultLandscapeColors };
    this.settings.visualization.colors.application = { ...defaultApplicationColors };
    this.updateSettings(this.settings);
  }

  setImpairedColors() {
    this.settings.visualization.colors.landscape = { ...visuallyImpairedLandscapeColors };
    this.settings.visualization.colors.application = { ...visuallyImpairedApplicationColors };
    this.updateSettings(this.settings);
  }

  setClassicColors() {
    this.settings.visualization.colors.landscape = { ...classicLandscapeColors };
    this.settings.visualization.colors.application = { ...classicApplicationColors };
    this.updateSettings(this.settings);
  }

  setDarkColors() {
    this.settings.visualization.colors.landscape = { ...darkLandscapeColors };
    this.settings.visualization.colors.application = { ...darkApplicationColors };
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
