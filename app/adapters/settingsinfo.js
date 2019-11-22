import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';

export default JSONAPIAdapter.extend(DataAdapterMixin,{

  host: ENV.APP.API_ROOT,

  init() {

    this.set('headers', {
      "Accept": "application/vnd.api+json"
    });
 
  },

  // @Override
  urlForFindRecord(id) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/settings/${id}`;
  },
  
  // @Override
  urlForFindAll() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/settings`;
  },
  
  // @Override
  urlForQuery() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/settings`;
  },

  // @Override
  // Overrides URL for model.save()
  urlForCreateRecord() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/settings`;
  },

  urlForDeleteRecord(id) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/settings/${id}`;
  },


  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  }

});
