import Model from 'ember-data/model';
import DS from 'ember-data';
import { computed } from '@ember/object';

const { attr } = DS;

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

	@attr() roles!: string[];

	hasRole(this: User, rolename:string): boolean {
		const roles = this.get('roles');
		for (const role of roles) {
			if(rolename === role)
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