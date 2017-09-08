import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-ui-frontend/config/environment';

const { JSONAPIAdapter } = DS;

/**
* This Adapter operates as communication abstraction for all network requests, 
* that refer to Landscape objects. It provides functions for fetching, 
* updating and uploading. However, at the time of writing this documentation 
* only fetching is implemented by the backend. 
* {{#crossLink "Landscape-Reload/updateObject:method"}}{{/crossLink}} shows an 
* exemplary requests.
* 
* @class Landscape-Adapter
* @extends DS.JSONAPIAdapter
*
* @module explorviz
* @submodule network
*/
export default JSONAPIAdapter.extend(DataAdapterMixin, {

  authorizer: 'authorizers:authorizers',

  host: ENV.APP.API_ROOT,
  namespace: "landscape",

  headers: {
    "Accept": "application/json"
  },

  //@Override
  urlForQueryRecord(query) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/${query}`;
  }

});
