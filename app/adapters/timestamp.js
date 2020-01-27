import JSONAPIAdapter from '@ember-data/adapter/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';
import { computed } from '@ember/object';

const { APP } = ENV;

/**
* This Adapter operates as communication abstraction for all network requests,
* that refer to Timestamp objects. It provides functions for fetching,
* updating and uploading. However, at the time of writing this documentation
* only fetching is implemented by the backend.
*
* @class Timestamp-Adapter
* @extends DS.JSONAPIAdapter
*
* @module explorviz
* @submodule network
*/
export default class TimestampAdapter extends JSONAPIAdapter.extend(DataAdapterMixin) {
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

  /**
   * Queries landscape or replay timestamps
   * @param {*} query
   */
  urlForQuery(query) {
    const baseUrl = this.buildURL();
    if (query.type === 'replay') {
      return `${baseUrl}/timestamps?filter[type]=replay`;
    }

    return `${baseUrl}/timestamps?filter[type]=landscape`;
  }
}
