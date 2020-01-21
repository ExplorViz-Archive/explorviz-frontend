import Constrainable from 'ember-route-constraints/mixins/constrainable';

declare module '@ember/mixins' {
  interface Registry {
    'Constrainable': any;
  }

}
