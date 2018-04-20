import JSONAPI from "./jsonapi";


export default JSONAPI.extend({

	modelName : "timestamp",

	attributes: null,

  init() {
    this._super(...arguments);

    this.set('attributes', {timestamp: "number", calls: "number"});
  }
});