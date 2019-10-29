import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

declare module '@ember/mixins' {
  interface Registry {
    'UnauthenticatedRouteMixin': any;
  }

}
