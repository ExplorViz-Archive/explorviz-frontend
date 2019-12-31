import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';
import { computed } from '@ember/object';

export default JSONAPIAdapter.extend(DataAdapterMixin, {

  host: ENV.APP.API_ROOT,

  headers: computed('session.data.authenticated.access_token', function() {
    let headers = { 'Accept': 'application/vnd.api+json' };
    if (this.session.isAuthenticated) {
      headers['Authorization'] = `Bearer ${this.session.data.authenticated.access_token}`;
    }

    return headers;
  }),

  // @Override
  urlForQuery(query) {
    let id = query.userId;
    // delete s.t. query parameter won't be attached (i.e. ?userId=id)
    delete query.userId;
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/preferences?filter[user]=${id}`;
  },

  // @Override
  // Overrides URL for model.save()
  urlForCreateRecord() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/preferences`;
  },

  urlForUpdateRecord(id) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/preferences/${id}`;
  },

  urlForDeleteRecord(id) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/preferences/${id}`;
  }

});
