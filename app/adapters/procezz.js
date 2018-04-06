import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';
 
const {JSONAPIAdapter} = DS;
const {APP} = ENV;


/**
* This Adapter operates as communication abstraction for all network requests, 
* that refer to Procezz objects. It provides functions for fetching, 
* updating and uploading.
*
* TODO more description
*
* @class Procezz-Adapter
* @extends DS.JSONAPIAdapter
*
* @module explorviz.discovery
* @submodule network
*/
export default JSONAPIAdapter.extend(DataAdapterMixin,{

  authorizer: 'authorizers:authorizers',

  host: APP.API_ROOT, 
  namespace: "discovery",

  headers: {
    "Accept": "application/vnd.api+json"
  },

  // @Override
  // Overrides URL for model.save()
  urlForUpdateRecord(id, modelName, snapshot) {
    const baseUrl = this.buildURL();

    let path = `${baseUrl}/${modelName}`;

    if(snapshot.adapterOptions && snapshot.adapterOptions.pathExtension) {
      const pathExtension = snapshot.adapterOptions.pathExtension;
      path = `${baseUrl}/${modelName}/${pathExtension}`;
    }

    return path;
  }

});