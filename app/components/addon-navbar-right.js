import Ember from 'ember';

export default Ember.Component.extend({
  configuration: Ember.inject.service("configuration"),
  tagName: "ul",
  classNames:["nav navbar-nav navbar-right"],
  elementId: "addon-navbar-right"
});
