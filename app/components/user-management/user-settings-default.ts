import Component from '@ember/component';

type Settings = {
  [origin: string]: {
    [settingsype:string]: [[string, any]]|[]
  }
};

export default class UserSettingsDefault extends Component {
  /*
    {
      origin1: {
        settingstype1: [[settingId1, value1], ...]
        settingstype2: [[settingId'1, value'1], ...]
      }
      origin2: {...}
    }
  */
  settings:Settings = {};
  /*
    {
      origin1: boolean1,
      origin2: boolean2
      ...
    }
  */
  useDefaultSettings:{[origin:string]: boolean} = {};
}
