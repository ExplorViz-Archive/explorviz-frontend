import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-ui-frontend/config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin,{
	
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
