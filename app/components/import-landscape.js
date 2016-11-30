import Ember from 'ember';

export default Ember.Component.extend({

  jsonLandscape: Ember.computed('landscape', function(){
    this.debug(this.get('landscape').get('systems'));

    this.debug(this.get('landscape.systems').name);

    return JSON.stringify(this.get('landscape'));
  })

});