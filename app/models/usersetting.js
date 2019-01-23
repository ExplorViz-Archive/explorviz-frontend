import DS from 'ember-data';
const { attr } = DS;

export default DS.Model.extend({

  showFpsCounter: attr('boolean'),
  appVizCommArrowSize: attr('number'),
  appVizTransparency: attr('boolean'),
  appVizTransparencyIntensity: attr('number'),
  booleanAttributes: hasMany('boolean')

});
