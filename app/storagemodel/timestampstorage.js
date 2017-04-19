import JSONAPI from "./jsonapi";
import timestampType from "./timestamp";

export default JSONAPI.extend({
	modelName : "timestampstorage",
	relationshipsToBeSaved: {timestamps: timestampType.create()},
	relationshipsToInclude: {timestamps: timestampType.create()},
	});