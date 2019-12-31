import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';
import { computed } from '@ember/object';

const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend(DataAdapterMixin, {

  host: ENV.APP.API_ROOT,
  namespace: "v1",

  headers: computed('session.data.authenticated.access_token', function() {
    let headers = { 'Accept': 'application/vnd.api+json' };
    if (this.session.isAuthenticated) {
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
    }

    return headers;
  }),

  urlForFindAll() {
    const baseUrl = this.buildURL();
    // the final "/" is important for Ember-Data ...
    return `${baseUrl}/roles/`;
  },

  //@Override
  urlForQueryRecord(query) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/${query}`;
  }

});
