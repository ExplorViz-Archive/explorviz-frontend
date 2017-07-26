import Ember from 'ember';

export default Ember.Component.extend({
  addonService: Ember.inject.service("addon-button-service"),
  tagName: "ul",
  classNames:["nav navbar-nav navbar-right"]
});
