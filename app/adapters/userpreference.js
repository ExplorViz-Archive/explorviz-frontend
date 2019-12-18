import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';

export default JSONAPIAdapter.extend(DataAdapterMixin, {

  host: ENV.APP.API_ROOT,

  init() {

    this.set('headers', {
      "Accept": "application/vnd.api+json"
    });

  },

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
  },

  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  }

});
