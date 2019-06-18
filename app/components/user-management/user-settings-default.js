import Component from '@ember/component';

export default Component.extend({
  /*
    {
      origin1: {
        settingstype1: [[settingId1, value1], ...]
        settingstype2: [[settingId'1, value'1], ...]
      }
      origin2: {...}
    }
  */
  settings: null,
  /*
    {
      origin1: boolean1,
      origin2: boolean2
      ...
    }
  */
  useDefaultSettings: null
});
