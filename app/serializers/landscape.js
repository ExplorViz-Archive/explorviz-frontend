import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
	
	//This attribute  will declare to serialize hasMany-relationships
	attrs:{systems:{serialize:true},
			applicationCommunication:{serialize:true}}
	
});
