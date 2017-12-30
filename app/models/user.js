import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
	
	username: attr("string"),
	password: attr("string"),
	token: attr("string"),
	isAuthenticated: attr("boolean")

});