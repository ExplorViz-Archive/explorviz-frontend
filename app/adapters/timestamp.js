import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-ui-frontend/config/environment';

const { JSONAPIAdapter } = DS;

/**
* This Adapter operates as communication abstraction for all network requests, 
* that refer to Timestamp objects. It provides functions for fetching, 
* updating and uploading. However, at the time of writing this documentation 
* only fetching is implemented by the backend. 
* {{#crossLink "Timeshift-Reload/updateObject:method"}}{{/crossLink}} shows an 
* exemplary requests.
* 
* @class Timestamp-Adapter
* @extends DS.JSONAPIAdapter
*/
export default JSONAPIAdapter.extend(DataAdapterMixin,{
	
	authorizer: 'authorizers:authorizers',

  host: ENV.APP.API_ROOT,
  

  headers: {
    "Accept": "application/json"
  },

  //@Override
  urlForQueryRecord(query) {
    let baseUrl = this.buildURL();
	if(query === "1"){
		return `${baseUrl}/timestamp/from-recent?intervalSize=100`;
	}else{
		return `${baseUrl}/timestamp/before-timestamp/${query}?intervalSize=100`;
	}
  },
  
  urlForQuery(query) {
    let baseUrl = this.buildURL();
	if(query === "1"){
		return `${baseUrl}/timestamp/from-recent?intervalSize=100`;
	}else{
		return `${baseUrl}/timestamp/before-timestamp/${query}?intervalSize=100`;
	}
  },
  
});
