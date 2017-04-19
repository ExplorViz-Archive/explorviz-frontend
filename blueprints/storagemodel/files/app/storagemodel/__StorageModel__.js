import JSONAPI from "./jsonapi";


export default JSONAPI.extend({
	
	// This value is important to identify the type and to save the Object in the right position
	//@override
	modelName: null,
	
	//This attribute is important to show, which attribute has which type
	//To identify you have to look in the models
	//@override
	attributes: {},
	
	// this attribute will decide, which attributes shall be saved into the Object
	// It has the following structure {[attributeNameOfModel]:[ModelType]}
	//@override
	relationshipsToBeSaved: {},
	
	//this attribute will determine, which relationships you want to have as included Relationships
	//@override
	relationshipsToInclude: {},
	
	});