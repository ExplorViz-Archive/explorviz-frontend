import Service from '@ember/service';
import TimestampstorageType from "../storagemodel/timestampstorage";
//import LandscapeType from "../storagemodel/landscape";


export default Service.extend({
  
  allowedTypes: null,

  init() {
    this._super(...arguments);

    this.set('allowedTypes', {
      "timestampstorage": TimestampstorageType.create()
      //"landscape" : LandscapeType.create()
    });

  },
    
  save: function(object){
    var json = object.serialize({includeId:true});
    for(var type in this.allowedTypes){
      if(type === json.data.type){
        return this.allowedTypes[type].saveItem(object, json);
      }
    }
    return false;
  },
  
  get: function(modelType, id){
    for(var type in this.allowedTypes){
      if(type === modelType){
        return this.allowedTypes[type].getItem(id);
      }
    }
    return false;
  },
  
  getWithInclude: function(modelType, id){
    for(var type in this.allowedTypes){
      if(type === modelType){
        return this.allowedTypes[type].getItemWithInclude(id);
      }
    }
    return false;
  },
  
});
