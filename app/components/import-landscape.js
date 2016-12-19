import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['viz'],

  didRender() {
    this._super(...arguments);

    // Basic Three.js setup
    var scene = new THREE.Scene();

    var height = this.$()[0].clientHeight;
    var width = this.$()[0].clientWidth;

    // explorviz landscape rendering

    const systems = this.get('landscape').get('systems'); 

    if(systems) {      
      systems.forEach(function(system) {

        addPlane(0,0,0,system.get('width'), system.get('height'), 0xff0000);

        const nodegroup = system.get('nodegroups');

        nodegroup.forEach(function(nodegroup) {

          const nodes = nodegroup.get('nodes');

          nodes.forEach(function(node) {

            //const color = new THREE.Color();

            addPlane(0, 0, 0.02, node.get('width'), 
              node.get('height'), node.get('backgroundColor'));          
          });

          
        });

      });
    }

    function addPlane(x, y, z, width, height, color) {
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), 
      new THREE.MeshBasicMaterial({color: color}));
      plane.position.set(x, y, z);
      scene.add(plane);
    }

    //

    scene.background = new THREE.Color(0xffffff);

    var camera = new THREE.PerspectiveCamera(70, width / height, 1, 10);
    camera.position.set(0, 0, 5);
    //camera.lookAt(scene.position);

    var renderer = new THREE.WebGLRenderer({ 
      antialias: true,  
      canvas: this.$('#threeCanvas')[0]
    });
    renderer.setSize(width, height);

    function render() {
      requestAnimationFrame(render); 
      renderer.render(scene, camera);
    }

    render();
  },

  jsonLandscape: Ember.computed('landscape', function(){   

    // option 1 to get systems

    //const systems = this.get('landscape').get('systems'); 
    //const system = systems.objectAt(0);

    //if(system) {
    //  console.log("system option 1", JSON.stringify(system));
    //}


    // option 2 to get systems

    var systemsRef = this.get('landscape').hasMany('systems');

    var systemsRecords;

    if(systemsRef.value()) {
      systemsRecords = systemsRef.value();

    // if(systemsRecords.objectAt(0)){
    //   console.log("system option 2", JSON.stringify(systemsRecords.objectAt(0)));
    //  }
    }

    // what is the difference in these options above?


    // Iteration for future renderer
    //if(systems) {      
    //  systems.forEach(function(item) {
    //    console.log("now iterate");
    //    console.log("system iterating", JSON.stringify(item));
    //  });
    //}

    //if(system) {
      // get nodegroup
    //  const nodegroup = system.get('nodegroups').objectAt(0);
    //  console.log("nodegroup", JSON.stringify(nodegroup));
    //}

    //return JSON.stringify(system);
    return JSON.stringify(this.get('landscape'));
  })

});