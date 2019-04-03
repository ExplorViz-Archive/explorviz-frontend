import Component from '@ember/component';

export default Component.extend({

  // No Ember generated container
  tagName: '',
  navbarActive: true,

  actions: {
    toggleNavbar() {
      this.toggleProperty('navbarActive');
    }
  }

});
