import JSONAPI from "./jsonapi";
import timestampType from "./timestamp";

export default JSONAPI.extend({

	modelName : "timestampstorage",

	relationshipsToBeSaved: null,
	relationshipsToInclude: null,

  init() {
    this._super(...arguments);

    this.set('relationshipsToBeSaved', {timestamps: timestampType.create()});
    this.set('relationshipsToInclude', {timestamps: timestampType.create()});
  },
});