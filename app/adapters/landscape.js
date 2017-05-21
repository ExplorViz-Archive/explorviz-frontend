import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-ui-frontend/config/environment';

const { JSONAPIAdapter } = DS;

export default JSONAPIAdapter.extend(DataAdapterMixin, {

  authorizer: 'authorizers:authorizers',

  //host: 'http://192.168.247.129:8081',
  host: ENV.APP.API_ROOT,

  headers: {
    "Accept": "application/json"
  },

  //@Override
  urlForQueryRecord(id, modelName) {
    let baseUrl = this.buildURL();
    return `${baseUrl}/${modelName}/${id}`;
  }

});
