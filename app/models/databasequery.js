import BaseEntity from './baseentity';
import attr from 'ember-data/attr';

export default BaseEntity.extend({
	
	SQLStatement: attr("string"),
	returnValue: attr("string"),
	timeInNanos: attr("number")

});