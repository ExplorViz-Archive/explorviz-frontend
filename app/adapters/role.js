import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';

const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend(DataAdapterMixin, {

  host: ENV.APP.API_ROOT,
  namespace: "v1",

  init() {

    this.set('headers', {
      "Accept": "application/vnd.api+json"
    });
 
  },

  urlForFindAll() {
    const baseUrl = this.buildURL();
    // the final "/" is important for Ember-Data ...
    return `${baseUrl}/roles/`;
  },

  //@Override
  urlForQueryRecord(query) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/${query}`;
  },

  authorize(xhr) {    
    let { access_token } = this.get('session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  }

});
