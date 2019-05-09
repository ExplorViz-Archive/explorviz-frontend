import Model from 'ember-data/model';
import DS from 'ember-data';
import { computed } from '@ember/object';
import Role from './role';

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
export default class User extends Model {

	@attr('string') username!: string;

	@attr('string') password!: string;

	@attr('string') token!: string;

	@hasMany('role') roles!: DS.PromiseManyArray<Role>;

	// simple object, no Ember record
	@attr() settings!: any;

	hasRole(this: User, rolename:string): boolean {
		const roles = this.get('roles').toArray();
		for (const role of roles) {
			if(rolename === role.get('descriptor'))
				return true;
		}
		return false;
  }
  
	@computed('roles')
	get isAdmin(this: User): boolean {
    return this.hasRole('admin');
	}

}

declare module 'ember-data/types/registries/model' {
	export default interface ModelRegistry {
	  'user': User;
	}
}