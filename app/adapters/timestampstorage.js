import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const {JSONAPIAdapter} = DS;

export default JSONAPIAdapter.extend(DataAdapterMixin, {

  authorizer: 'authorizers:authorizers',

  host: 'http://192.168.247.129:8081',
  //host: 'http://localhost:8081',

  headers: {
    "Accept": "application/json"
  },

  //@Override
  urlForQueryRecord() {
    let baseUrl = this.buildURL();
    return `${baseUrl}/timestamp/show-timestamps`;
  }

});
