// @ts-ignore
import SessionESA from 'ember-simple-auth/services/session';

declare module '@ember/service' {
  interface Registry {
    'session': SessionESA;
  }
}