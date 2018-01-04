import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';

export default JSONAPIAdapter.extend(DataAdapterMixin,{

	authorizer: 'authorizers:authorizers',
	host: ENV.APP.API_ROOT,
	namespace: 'users',

	headers: {
		"Accept": "application/vnd.api+json"
	},

	// @Override
	urlForQueryRecord() {
		const baseUrl = this.buildURL();
   		return `${baseUrl}`;
	},

	//@Override
	urlForUpdateRecord(id, modelName, snapshot) {
		const baseUrl = this.buildURL();
		let path = `${baseUrl}`;

		if(snapshot.adapterOptions && snapshot.adapterOptions.pathExtension) {
			const pathExtension = snapshot.adapterOptions.pathExtension;
			path = `${baseUrl}/${pathExtension}`;
		}

		return path;
	}

});
