import ApplicationSerializer from './application';

/**
* TODO
*
* @class Landscape-Serializer
* @extends Application-Serializer
*/
export default ApplicationSerializer.extend({

  //This attribute will declare to serialize hasMany-relationships
  attrs:{
    systems:{serialize:true},
    totalApplicationCommunications:{serialize:true}
  }

});
