import Model from 'ember-data/model';
import DS from 'ember-data';
import { computed } from '@ember/object';

const { attr, hasMany } = DS;

/**
 * Ember model for a User.
 *
 * @class user-Model
 * @extends @extends BaseEntity-Model
 *
 * @module explorviz
 * @submodule model
 *
 */
export default class User extends Model.extend({

	username: attr('string'),
	password: attr('string'),
	token: attr('string'),

	roles: hasMany('role'),

	// simple object, no Ember record
	settings: attr(),

	hasRole(this: User, rolename:string): boolean {
		const roles = this.get('roles').toArray();
		for (const role of roles) {
			if(rolename === role.get('descriptor'))
				return true;
		}
		return false;
  },
  
  isAdmin: computed('roles', function(this: User): boolean {
    return this.hasRole('admin');
  })

}) {}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'user': User;
	}
}