import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';
 
const {JSONAPIAdapter} = DS;
const {APP} = ENV;


/**
* This Adapter operates as communication abstraction for all network requests, 
* that refer to Agent objects. It provides functions for fetching, 
* updating and uploading.
*
* TODO more description
*
* @class Agent-Adapter
* @extends DS.JSONAPIAdapter
*
* @module explorviz.discovery
* @submodule network
*/
export default JSONAPIAdapter.extend(DataAdapterMixin,{

  host: APP.API_ROOT,

  init() {
    this.set('headers', {
      "Accept": "application/vnd.api+json"
    }); 
  },

  //@Override
  urlForQueryRecord(query) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/${query}`;
  },

  // @Override
  // Overrides URL for model.save()
  urlForUpdateRecord(id) {
    const baseUrl = this.buildURL();

    return `${baseUrl}/v1/agents/${id}`;
  },

  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  }


});