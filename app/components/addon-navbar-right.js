import Ember from 'ember';

const {Component, inject} = Ember;

/**
* This predefined (by Simple-Auth) authorizer injects the token, that is given 
* by the backend and acquired by the authenticator after successful 
* authentication, in every future request. This token is necessary, since all 
* backend-resources (except the AuthenticationEndpoint) are secured by a 
* token-based authorization mechanism. 
* 
* @class Addon-Navbar-Right-Component
* @extends Ember.Component
*/
export default Component.extend({
  configuration: inject.service("configuration"),
  tagName: "ul",
  classNames:["nav navbar-nav navbar-right"],
  elementId: "addon-navbar-right"
});
