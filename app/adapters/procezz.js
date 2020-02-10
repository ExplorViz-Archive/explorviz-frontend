import JSONAPIAdapter from '@ember-data/adapter/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';
import { computed } from '@ember/object';

const { APP } = ENV;

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
export default class ProcezzAdapter extends JSONAPIAdapter.extend(DataAdapterMixin) {
  host = APP.API_ROOT;

  namespace = 'v1';

  @computed('session.data.authenticated.access_token')
  get headers() {
    const headers = { Accept: 'application/vnd.api+json' };
    if (this.session.isAuthenticated) {
      headers.Authorization = `Bearer ${this.session.data.authenticated.access_token}`;
    }

    return headers;
  }

  // @Override
  // Overrides URL for model.save()
  urlForUpdateRecord(id, modelName, snapshot) {
    const baseUrl = this.buildURL();

    const agentId = snapshot.belongsTo('agent', { id: true });
    return `${baseUrl}/agents/${agentId}/procezzes/${id}`;
  }
}
