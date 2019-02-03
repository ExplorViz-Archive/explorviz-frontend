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
export default Model.extend({

	username: attr('string'),
	password: attr('string'),
	token: attr('string'),

	roles: hasMany('role'),

	// simple object, no Ember record
	settings: attr(),

	hasRole(rolename) {
		const roles = this.get('roles').toArray();
		for (const role of roles) {
			if(rolename === role.get('descriptor'))
				return true;
		}
		return false;
  },
  
  isAdmin: computed('roles', function() {
    return this.hasRole('admin');
  })

});
