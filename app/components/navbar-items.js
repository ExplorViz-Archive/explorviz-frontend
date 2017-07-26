import Ember from 'ember';

export default Ember.Component.extend({
	tagName: "ul",

	classNames:["nav", "navbar-nav"],

	navbarService: Ember.inject.service('navbar-labels'),

  actions: {
    resetToLandscapeView() {
      this.sendAction("resetToLandscapeView");
    }
  }
});
