import { computed } from '@ember/object';
import DS from 'ember-data';
import Model from 'ember-data/model';

const { attr } = DS;

/**
 * Ember model for a User.
 *
 * @class User
 *
 * @module explorviz
 * @submodule model
 *
 */
export default class User extends Model {
  @attr('string') username!: string;

  @attr('string') password!: string;

  @attr('string') token!: string;

  @attr() roles!: string[];

  hasRole(rolename: string): boolean {
    return this.roles.includes(rolename);
  }

  @computed('roles')
  get isAdmin(): boolean {
    return this.hasRole('admin');
  }
}

declare module 'ember-data/types/registries/model' {
  // tslint:disable-next-line: interface-name
  export default interface ModelRegistry {
    'user': User;
  }
}
