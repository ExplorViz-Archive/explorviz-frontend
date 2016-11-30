import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const { RESTAdapter } = DS;

export default RESTAdapter.extend(DataAdapterMixin, {

  authorizer: 'authorizers:authorizers',

  host: 'http://localhost:8080',

  headers: {
    "Accept": "application/json"
  }

});
