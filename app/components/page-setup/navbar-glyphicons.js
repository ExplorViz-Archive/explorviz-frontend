import Ember from 'ember';

const {Component, inject} = Ember;

/**
* This component renders all components (!), that are registered in 
* {{#crossLink "Page-Setup-Service"}}{{/crossLink}}, as nav-glyphicons.
* 
* @class Navbar-Glyphicons
* @extends Ember.Component
*
* @module explorviz
* @submodule page
*/
export default Component.extend({

  pageSetupService: inject.service("page-setup"),

  tagName: "ul",
  classNames:["nav navbar-nav navbar-right"],
  elementId: "navbar-glyphicons"
});
