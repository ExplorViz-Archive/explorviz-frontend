import Router from "explorviz-frontend/router";

export function initialize(/* appInstance */) {

  console.log('initializer router.js');
  Router.configurationRouteExtensions = ['settings'];
}

export default {
  name: 'router',
  initialize
};
