import Component from '@ember/component';
import { typeOf } from '@ember/utils';

export default Component.extend({
  // No Ember generated container
  tagName: '',

  store: service(),

  didInsertElement() {
    this.get('store').find('user', 3).then(user => {
      const usersettings = user.settings;
      Object.entries(usersettings).forEach(
        ([key, value]) => {
          console.log(key, value)
          const type = typeOf(value);
          console.log(type)
        }
      );

      usersettings.forEach(date => {
        const type = typeOf(date);
        console.log(type)
      });
    });
  }
});
