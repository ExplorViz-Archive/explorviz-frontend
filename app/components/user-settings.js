import Component from '@ember/component';
// import { typeOf } from '@ember/utils';
import { inject as service } from "@ember/service";

export default Component.extend({
  // No Ember generated container
  tagName: '',

  store: service(),

/*  didInsertElement() {
    this.get('store').find('user', 3).then(user => {
     const usersettings = user.settings;
      Object.entries(usersettings).forEach(
        ([key, value]) => {
          const type = typeOf(value);
        }
      );

      usersettings.forEach(date => {
        const type = typeOf(date);
      });
    }); 
  }*/
});
