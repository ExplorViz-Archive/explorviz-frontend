import DS from 'ember-data';
const { attr } = DS;

export default DS.Model.extend({

  showFpsCounter: attr('boolean'),
	appVizClassColor: attr('string')

});
