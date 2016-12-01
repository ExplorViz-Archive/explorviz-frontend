import Ember from 'ember';

export default Ember.Component.extend({

  jsonLandscape: Ember.computed('landscape', function(){
    this.debug(this.get('landscape').get('systems'));

    var landscape = this.get('landscape');

    //var systemsRef = landscape.hasMany('systems');
    //var systems = systemsRef.value();

    return JSON.stringify(this.get('landscape'));
  })

});