import JSONAPIAdapter from '@ember-data/adapter/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';
import { computed } from '@ember/object';
 
const { APP } = ENV;

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
export default class AgentAdapter extends JSONAPIAdapter.extend(DataAdapterMixin) {

  host = APP.API_ROOT;
  namespace = 'v1';

  @computed('session.data.authenticated.access_token')
  get headers() {
    let headers = { 'Accept': 'application/vnd.api+json' };
    if (this.session.isAuthenticated) {
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
    }

    return headers;
  }

  //@Override
  urlForQueryRecord(query) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/${query}`;
  }

  // @Override
  // Overrides URL for model.save()
  urlForUpdateRecord(id) {
    const baseUrl = this.buildURL();

    return `${baseUrl}/v1/agents/${id}`;
  }

}