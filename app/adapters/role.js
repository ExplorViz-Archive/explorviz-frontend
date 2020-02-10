import JSONAPIAdapter from '@ember-data/adapter/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';
import { computed } from '@ember/object';

const { APP } = ENV;

export default class RoleAdapter extends JSONAPIAdapter.extend(DataAdapterMixin) {
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

  urlForFindAll() {
    const baseUrl = this.buildURL();
    // the final "/" is important for Ember-Data ...
    return `${baseUrl}/roles`;
  }

  // @Override
  urlForQueryRecord(query) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/${query}`;
  }
}
