import Model from 'ember-data/model';
import attr from 'ember-data/attr';

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
	isAuthenticated: attr('boolean')

});
