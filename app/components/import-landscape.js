import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['viz'],

  jsonLandscape: Ember.computed('landscape', function(){   

    // option 1 to get systems

    const systems = this.get('landscape').get('systems'); 
    console.log(JSON.stringify(systems.objectAt(0)));


    // option 2 to get systems

    var systemsRef = this.get('landscape').hasMany('systems');

    var systemsRecords;

    if(systemsRef.value()) {
      systemsRecords = systemsRef.value();
      console.log(JSON.stringify(systemsRecords.objectAt(0)));
    }

    // what is the difference in these options above?


    // Iteration for future

    console.log("now iterate");

    systems.forEach(function(item) {
      console.log(JSON.stringify(item));
    });

    //return JSON.stringify(systems.objectAt(0));
    return JSON.stringify(this.get('landscape'));
  })

});