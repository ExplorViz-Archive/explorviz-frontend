import JSONAPIAdapter from '@ember-data/adapter/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';
import { computed } from '@ember/object';

const { APP } = ENV;

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
export default class LandscapeAdapter extends JSONAPIAdapter.extend(DataAdapterMixin) {

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

}
