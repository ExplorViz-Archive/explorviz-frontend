import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';
import { computed } from '@ember/object';

export default JSONAPIAdapter.extend(DataAdapterMixin,{

  host: ENV.APP.API_ROOT,

  headers: computed('session.data.authenticated.access_token', function() {
    let headers = { 'Accept': 'application/vnd.api+json' };
    if (this.session.isAuthenticated) {
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
    }

    return headers;
  }),

  urlForUpdateRecord(id) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/users/${id}`;
  },

  urlForDeleteRecord(id) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/users/${id}`;
  },

  urlForFindAll() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/users/`;
  },
  // @Override
  urlForQueryRecord() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/users`;
  },

  // @Override
  urlForQuery() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/users`;
  },

  urlForFindRecord(id) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/users/${id}`;
  },

  // @Override
  // Overrides URL for model.save()
  urlForCreateRecord() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/users/`;
  }

});
