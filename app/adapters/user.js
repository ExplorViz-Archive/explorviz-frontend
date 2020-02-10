import JSONAPIAdapter from '@ember-data/adapter/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';
import { computed } from '@ember/object';

const { APP } = ENV;

export default class UserAdapter extends JSONAPIAdapter.extend(DataAdapterMixin) {
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

  urlForUpdateRecord(id) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/users/${id}`;
  }

  urlForDeleteRecord(id) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/users/${id}`;
  }

  // @Override
  urlForQueryRecord() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/users`;
  }

  // @Override
  urlForQuery() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/users`;
  }

  urlForFindRecord(id) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/users/${id}`;
  }

  // @Override
  // Overrides URL for model.save()
  urlForCreateRecord() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/users`;
  }
}
