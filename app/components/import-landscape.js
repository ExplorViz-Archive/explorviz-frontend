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

        const systemMesh = addPlane(0,0,0,system.get('width'), system.get('height'), 
          new THREE.Color(x,y,z), null, scene);

        const nodegroup = system.get('nodegroups');

        nodegroup.forEach(function(nodegroup) {

          const nodes = nodegroup.get('nodes');

          nodes.forEach(function(node) {

            const{x, y, z} = node.get('color');

            const nodeMesh = addPlane(0, 0, 0, node.get('width'), 
              node.get('height'), new THREE.Color(x,y,z), null, systemMesh);  

            const applications = node.get('applications');

            applications.forEach(function(application) {

              const{x, y, z} = application.get('backgroundColor'); 

              const applicationMesh = addPlane(0, 0, 0, application.get('width'), 
                application.get('height'), new THREE.Color(x,y,z), null, nodeMesh);     

              applicationMesh.geometry.computeBoundingBox();

              const logoSize = {width: 0.4, height: 0.4};
              const appBBox = applicationMesh.geometry.boundingBox;  

              const logoPos = {x : 0, y : 0, z : 0};             

              logoPos.x = appBBox.max.x - logoSize.width * 0.7;

              console.log(application.get('programmingLanguage').toLowerCase());

              const texturePartialPath = application.get('database') ? 
                'database2' : application.get('programmingLanguage').toLowerCase();

              addPlane(logoPos.x, logoPos.y, logoPos.z, 
                logoSize.width, logoSize.height, new THREE.Color(1,0,0), 
                texturePartialPath, applicationMesh);

            }); 

          });
          
        });

      });
    }

    function addPlane(x, y, z, width, height, color, texture, parent) {

      if(texture) {
         
         new THREE.TextureLoader().load('images/logos/' + texture + '.png', (texture) => {
            const material = new THREE.MeshBasicMaterial({map: texture, transparent: true});
            const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), 
             material);
            plane.position.set(x, y, z);
            parent.add(plane);
            return plane;
          });   

        
      } else {

        const material = new THREE.MeshBasicMaterial({color: color});
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), 
          material);
        plane.position.set(x, y, z);
        parent.add(plane);
        return plane;
      }

      
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