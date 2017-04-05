import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
	//the attribute attrs decides, how the different models attributes, will be serialized
	attrs:{
		timestamps:{serialize: true}
	}
});
