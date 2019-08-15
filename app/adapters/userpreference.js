import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';
import { inject as service } from "@ember/service";
import { isEmpty } from '@ember/utils';

export default JSONAPIAdapter.extend(DataAdapterMixin, {

  host: ENV.APP.API_ROOT,

  session: service(),

  init() {

    this.set('headers', {
      "Accept": "application/vnd.api+json"
    });

  },

  // @Override
  urlForQuery() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/settings/preferences`;
  },

  // @Override
  // Overrides URL for model.save()
  urlForCreateRecord() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/users/settings/preferences`;
  },

  urlForUpdateRecord(id) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/users/settings/preferences/${id}`;
  },

  urlForDeleteRecord(id) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/v1/users/settings/preferences/${id}`;
  },

  urlForFindAll(modelName, snapshot) {

    const baseUrl = this.buildURL();
    let userId = undefined;

    // TODO Why is passed userId undefined from second execution on?
    // this is a workaround for retrieving the user id from the session
    if (isEmpty(snapshot.adapterOptions.userId)) {
      userId = this.get('session').get('session.content.authenticated.rawUserData.data.id');
    }
    else {
      userId = snapshot.adapterOptions.userId;
    }
    return `${baseUrl}/v1/users/${userId}/settings/preferences`;
  },

  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  }

});
