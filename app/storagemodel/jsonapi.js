import Object from '@ember/object';
import { computed } from '@ember/object';

//This Object is to define the different functions neccesary for the Object to work
export default Object.extend({

	// This value is important to identify the type and to save the Object in the right position
	modelName: null,

	//This attribute is important to show, which attribute has which type
	//To identify you have to look in the models
	attributes: null,


	// this attribute will decide, which attributes shall be saved into the Object
	// It has the following structure {[attributeNameOfModel]:[ModelType]}
	relationshipsToBeSaved: null,


	//This param is used to decide, which relationships of which type shall be included in getItemWithInclude
	relationshipsToInclude: null,



	//The modelStorage will be the part in the localStorage for saving Objects of this model
	modelStorage: computed("modelName", function(){
		var modelStorage = localStorage.getItem(this.modelName);
		modelStorage = JSON.parse(modelStorage);
		return (modelStorage ? modelStorage : {});
	}),

	init() {
		this._super(...arguments);

		this.set('attributes', {});
		this.set('relationshipsToBeSaved', {});
		this.set('relationshipsToInclude', {});
	},


	//This important to see if a Json has the right format
	areAttributesRightType(json){
		var attributes = this.attributes;
		for(var key in attributes){
			if(typeof(json.data.attributes[key]) !== attributes[key]){
				return false;
			}
		}
		return true;
	},


	isValidObject(json){
		if(json.type !== this.model || !this.areAttributesRightType(json)){
			return false;
		}
		return true;
	},


	//The json shall be the serialized version of the Object
	saveItem(object, json){
		var savableItem = this.convertJSONIntoSavable(json);
		this.saveRelationships(object);
		var modelStorage = this.get("modelStorage");
		modelStorage[(this.getStoreID(json))] = savableItem;
		window.localStorage.setItem(this.modelName, JSON.stringify(modelStorage));
		return true;

	},

	saveItems(itemArray){
		var length = itemArray.length;
		var jsonArray = [];
		for(var i = 0; i<length; i++){
			var item = itemArray[i];
			var jsonItem = item.serialize({includeId:true});
			jsonItem = this.convertJSONIntoSavable(jsonItem);
			if(!this.saveRelationships(item)){
				return false;
			}
			jsonArray.push(jsonItem);
		}
		var modelStorage = this.get("modelStorage");
		for(var k = 0; k<length; k++){
			var elem = jsonArray[k];
			var id = this.getStoreID(elem);
			modelStorage[id] = elem;
		}
		window.localStorage.setItem(this.get("modelName"), JSON.stringify(modelStorage));
		return true;

	},

	//This can be used to serialize the Json into a better format
	convertJSONIntoSavable(json){
		if(!this.isValidObject(json)){
			return false;
		}
		return json;
	},

	//This function will be used to
	getStoreID(json){
		var key = json.data.id;
		return key;
	},

	saveRelationships(object){
		const self = this;
		for(var key in this.relationshipsToBeSaved){
			var relationships = object.get(key);
			var array = relationships.toArray();
			self.relationshipsToBeSaved[key].saveItems(array);
		}
		return true;
	},

	getItem: function(id){
		return this.get("modelStorage")[id];
	},

	getItemWithInclude: function(id){
		var relationshipsToInclude = this.relationshipsToInclude;
		var result = this.getItem(id);
		if(!result){
			return undefined;
		}
		var relationships = result.data.relationships;
		var included = [];
		for(var type in this.relationshipsToInclude){
			//fragt ab, ob das Element existiert
			var relationshipsOfType = relationships[type];
			if(relationshipsOfType){
				var elems = relationshipsOfType.data;
				var len = elems.length;
				for(var i = 0; i<len; i++){
					var relationshipID = elems[i]["id"];
					var ob = relationshipsToInclude[type].getItemWithInclude(relationshipID);
					if(ob){
						included.push(ob);
					}
				}
			}
		}
		result.included = included;
		return result;
	},

});

