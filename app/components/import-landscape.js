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

        const{x, y, z} = system.get('backgroundColor');

        addPlane(0,0,0,system.get('width'), system.get('height'), 
          new THREE.Color(x,y,z));

        const nodegroup = system.get('nodegroups');

        nodegroup.forEach(function(nodegroup) {

          const nodes = nodegroup.get('nodes');

          nodes.forEach(function(node) {

            const{x, y, z} = node.get('backgroundColor');

            addPlane(0, 0, 0, node.get('width'), 
              node.get('height'), new THREE.Color(x,y,z));  

            const applications = node.get('applications');

            applications.forEach(function(application) {

              const{x, y, z} = application.get('backgroundColor');
              addPlane(0, 0, 0, application.get('width'), 
                application.get('height'), new THREE.Color(x,y,z)); 

            });          


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
  }

});