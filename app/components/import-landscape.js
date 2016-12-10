import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['viz'],

  didRender() {
    this._super(...arguments);

    // Basic Three.js setup
    var scene = new THREE.Scene();

    var height = this.$()[0].clientHeight;
    var width = this.$()[0].clientWidth;

    var cube = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2), 
      new THREE.MeshNormalMaterial());
    scene.add(cube);

    scene.background = new THREE.Color(0xf2f2f2);

    var camera = new THREE.PerspectiveCamera(70, width / height, 1, 10);
    camera.position.set(0, 3.5, 5);
    camera.lookAt(scene.position);

    var renderer = new THREE.WebGLRenderer({ 
      antialias: true,  
      canvas: this.$('#threeCanvas')[0]
    });
    renderer.setSize(width, height);

    function render() {
      requestAnimationFrame(render);
      
      cube.rotation.x -= 0.01 * 2;
      cube.rotation.y -= 0.01;
      cube.rotation.z -= 0.01 * 3;

      renderer.render(scene, camera);
    }

    //Ember.$(".viz").append(renderer.domElement);

    render();
  },

  jsonLandscape: Ember.computed('landscape', function(){   

    // option 1 to get systems

    const systems = this.get('landscape').get('systems'); 
    const system = systems.objectAt(0);

    if(system) {
      console.log("system option 1", JSON.stringify(system));
    }


    // option 2 to get systems

    var systemsRef = this.get('landscape').hasMany('systems');

    var systemsRecords;

    if(systemsRef.value()) {
      systemsRecords = systemsRef.value();

      if(systemsRecords.objectAt(0)){
        console.log("system option 2", JSON.stringify(systemsRecords.objectAt(0)));
      }
    }

    // what is the difference in these options above?


    // Iteration for future renderer
    if(systems) {      
      systems.forEach(function(item) {
        console.log("now iterate");
        console.log("system iterating", JSON.stringify(item));
      });
    }

    if(system) {
      // get nodegroup
      const nodegroup = system.get('nodegroups').objectAt(0);
      console.log("nodegroup", JSON.stringify(nodegroup));
    }

    //return JSON.stringify(system);
    return JSON.stringify(this.get('landscape'));
  })

});