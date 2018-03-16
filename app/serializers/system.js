import ApplicationSerializer from './application';

/**
 * TODO
 *
 * @class System-Serializer
 * @extends Application-Serializer
 */
export default ApplicationSerializer.extend({

  //This attribute will declare to serialize hasMany-relationships
  attrs:{
    nodegroups:{serialize:true},
  }

});
