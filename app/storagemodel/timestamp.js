import JSONAPI from "./jsonapi";


export default JSONAPI.extend({
	modelName : "timestamp",
	attributes: {timestamp: "number", calls: "number"},
	});