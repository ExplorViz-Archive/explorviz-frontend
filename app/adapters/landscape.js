import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-ui-frontend/config/environment';

const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend(DataAdapterMixin, {

  authorizer: 'authorizers:authorizers',

  host: ENV.APP.API_ROOT,
  namespace: 'landscape',

  headers: {
    "Accept": "application/json"
  },

  //@Override
  urlForQueryRecord(query) {
    let baseUrl = this.buildURL();
    return `${baseUrl}/${query}`;
  }

});
