import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export interface Settings {
  colors: {
    application: ApplicationColorsHexString;
    landscape: LandscapeColorsHexString;
  };
  flags: FlagSettings;
  ranges: RangeSettings;
}

export interface Setting<T> {
  displayName: string;
  description: string;
  value: T;
}

export type FlagSetting = Setting<boolean>;

export interface RangeSetting extends Setting<number> {
  range: {
    min: number;
    max: number;
  };
}

export interface FlagSettings {
  showFpsCounter: FlagSetting;
  enableHoverEffects: FlagSetting;
  keepHighlightingOnOpenOrClose: FlagSetting;
}

export interface RangeSettings {
  appVizTransparencyIntensity: RangeSetting;
  appVizCommArrowSize: RangeSetting;
  appVizCurvyCommHeight: RangeSetting;
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

const defaultFlags: FlagSettings = {
  showFpsCounter: {
    displayName: 'Show FPS Counter',
    description: '\'Frames Per Second\' metrics in visualizations',
    value: false,
  },
  enableHoverEffects: {
    displayName: 'Enable Hover Effects',
    description: 'Hover effect (flashing entities) for mouse cursor',
    value: true,
  },
  keepHighlightingOnOpenOrClose: {
    displayName: 'Keep Highlighting On Open Or Close',
    description: 'Toggle if highlighting should be resetted on double click in application visualization',
    value: true,
  },
};

const defaultRanges: RangeSettings = {
  appVizTransparencyIntensity: {
    displayName: 'Transparency Intensity in Application Visualization',
    description: 'Transparency effect intensity (\'Enable Transparent Components\' must be enabled)',
    value: 0.1,
    range: {
      min: 0.1,
      max: 1.0,
    },
  },
  appVizCommArrowSize: {
    displayName: 'Arrow Size in Application Visualization',
    description: 'Arrow Size for selected communications in application visualization',
    value: 1.0,
    range: {
      min: 0.0,
      max: 5.0,
    },
  },
  appVizCurvyCommHeight: {
    displayName: 'Curviness factor of the Communication Lines',
    description: 'If greater 0.0, communication lines are rendered arc-shaped (Straight lines: 0.0)',
    value: 0.0,
    range: {
      min: 0.0,
      max: 1.5,
    },
  },
};

export default class UserSettings extends Service {
  @tracked
  settings!: Settings;

  constructor() {
    super(...arguments);
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
      colors: {
        application: { ...defaultApplicationColors },
        landscape: { ...defaultLandscapeColors },
      },
      flags: { ...defaultFlags },
      ranges: { ...defaultRanges },
    };

    this.updateSettings(settings);
  }

  updateSettings(settings: Settings) {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    this.set('settings', settings);
  }

  updateFlagSetting(attribute: keyof FlagSettings, value: boolean) {
    this.settings.flags[attribute] = { ...this.settings.flags[attribute], value };
    this.updateSettings(this.settings);
  }

  updateRangeSetting(attribute: keyof RangeSettings, value: number) {
    const { range } = this.settings.ranges[attribute];
    if (Number.isNaN(value)) {
      throw new Error('Value is not a number');
    } else if (value < range.min || value > range.max) {
      throw new Error(`Value must be between ${range.min} and ${range.max}`);
    }
    this.settings.ranges[attribute] = { ...this.settings.ranges[attribute], value };
    this.updateSettings(this.settings);
  }

  updateLandscapeColor(attribute: keyof LandscapeColorsHexString, value: string) {
    this.settings.colors.landscape[attribute] = value;
    this.updateSettings(this.settings);
  }

  updateApplicationColor(attribute: keyof ApplicationColorsHexString, value: string) {
    this.settings.colors.application[attribute] = value;
    this.updateSettings(this.settings);
  }

  setDefaultColors() {
    this.settings.colors.landscape = { ...defaultLandscapeColors };
    this.settings.colors.application = { ...defaultApplicationColors };
    this.updateSettings(this.settings);
  }

  setImpairedColors() {
    this.settings.colors.landscape = { ...visuallyImpairedLandscapeColors };
    this.settings.colors.application = { ...visuallyImpairedApplicationColors };
    this.updateSettings(this.settings);
  }

  setClassicColors() {
    this.settings.colors.landscape = { ...classicLandscapeColors };
    this.settings.colors.application = { ...classicApplicationColors };
    this.updateSettings(this.settings);
  }

  setDarkColors() {
    this.settings.colors.landscape = { ...darkLandscapeColors };
    this.settings.colors.application = { ...darkApplicationColors };
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
