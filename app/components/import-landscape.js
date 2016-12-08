import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['viz'],

  jsonLandscape: Ember.computed('landscape', function(){   

    // option 1 to get systems

    const systems = this.get('landscape').get('systems'); 
    const system = systems.objectAt(0);
    console.log("system option 1", JSON.stringify(system));


    // option 2 to get systems

    var systemsRef = this.get('landscape').hasMany('systems');

    var systemsRecords;

    if(systemsRef.value()) {
      systemsRecords = systemsRef.value();
      console.log("system option 2", JSON.stringify(systemsRecords.objectAt(0)));
    }

    // what is the difference in these options above?


    // Iteration for future renderer

    console.log("now iterate");

    systems.forEach(function(item) {
      console.log("system iterating", JSON.stringify(item));
    });


    // get nodegroup
    const nodegroup = system.get('nodegroups').objectAt(0);
    console.log("nodegroup", JSON.stringify(nodegroup));

    return JSON.stringify(system);
    //return JSON.stringify(this.get('landscape'));
  })

});