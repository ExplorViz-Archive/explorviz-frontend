import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';
import { computed } from '@ember/object';
 
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

  headers: computed('session.data.authenticated.access_token', function() {
    let headers = { 'Accept': 'application/vnd.api+json' };
    if (this.session.isAuthenticated) {
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
    }

    return headers;
  }),

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
  }

});