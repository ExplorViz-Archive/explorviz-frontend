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

        var extensionX = system.get('width') / 2.0;
        var centerX = system.get('positionX') + extensionX - 0;

        var extensionY = system.get('height') / 2.0;
        var centerY = system.get('positionY') - extensionY - 0;

        const systemMesh = addPlane(centerX,centerY,0,system.get('width'), system.get('height'), 
          new THREE.Color(x,y,z), null, scene);

        const nodegroup = system.get('nodegroups');

        nodegroup.forEach(function(nodegroup) {

          const nodes = nodegroup.get('nodes');

          nodes.forEach(function(node) {

            const{x, y, z} = node.get('color');

            var extensionX = node.get('width') / 2.0;
            var extensionY = node.get('height') / 2.0;

            var centerX = node.get('positionX') + extensionX - 0;          
            var centerY = node.get('positionY') - extensionY - 0;

            const nodeMesh = addPlane(centerX, centerY, 0, node.get('width'), 
              node.get('height'), new THREE.Color(x,y,z), null, scene);  

            const applications = node.get('applications');

            applications.forEach(function(application) {

              const{x, y, z} = application.get('backgroundColor'); 

              var extensionX = application.get('width') / 2.0;
              var extensionY = application.get('height') / 2.0;

              var centerX = application.get('positionX') + extensionX - 0;          
              var centerY = application.get('positionY') - extensionY - 0;

              const applicationMesh = addPlane(centerX, centerY, 0, application.get('width'), 
                application.get('height'), new THREE.Color(x,y,z), null, scene);     

              applicationMesh.geometry.computeBoundingBox();

              const logoSize = {width: 0.4, height: 0.4};
              const appBBox = applicationMesh.geometry.boundingBox;  

              const logoPos = {x : 0, y : 0, z : 0};    

              const logoLeftPadding = logoSize.width * 0.7;

              logoPos.x = appBBox.max.x - logoLeftPadding;

              const texturePartialPath = application.get('database') ? 
                'database2' : application.get('programmingLanguage').toLowerCase();

              addPlane(logoPos.x, logoPos.y, logoPos.z, 
                logoSize.width, logoSize.height, new THREE.Color(1,0,0), 
                texturePartialPath, applicationMesh);

              new THREE.FontLoader().load('three.js/fonts/helvetiker_regular.typeface.json', 
                (font) => {

                  var labelGeo = new THREE.TextGeometry(
                    application.get('name'),
                    {
                      font: font,
                      size: 0.1,
                      height: 0
                    }
                  );
                  
                  labelGeo.computeBoundingBox();
                  var bboxText = labelGeo.boundingBox;
                  var textWidth = bboxText.max.x - bboxText.min.x;

                  var bboxParent = appBBox;
                  var labelRightPadding = 0.1;
                  var boxWidth =  Math.abs(bboxParent.max.x) + 
                    Math.abs(bboxParent.min.x) - logoSize.width - 
                    logoLeftPadding + labelRightPadding;                

                  // upper scaling factor
                  var i = 1.0;
                  // until text fits into the parent bounding box
                  while ((textWidth > boxWidth) && (i > 0.1)) {    
                     // TODO time complexity: linear -> Do binary search alike approach                         
                    i -= 0.1;
                    labelGeo.scale(i, i, i);
                    // update the BoundingBox
                    labelGeo.computeBoundingBox();
                    bboxText = labelGeo.boundingBox;
                    textWidth = bboxText.max.x - bboxText.min.x;
                  }

                  // center position                 
                  var posX = appBBox.min.x + labelRightPadding;

                  var material = new THREE.MeshBasicMaterial({color: 0xffffff});

                  var labelMesh = new THREE.Mesh(labelGeo, material);

                  labelMesh.position.set(posX, 0, 0);

                  applicationMesh.add(labelMesh);

                  //

                  labelGeo = new THREE.TextGeometry(
                    node.get('name'),
                    {
                      font: font,
                      size: 0.1,
                      height: 0
                    }
                  );
                  
                  labelGeo.computeBoundingBox();
                  bboxText = labelGeo.boundingBox;
                  textWidth = bboxText.max.x - bboxText.min.x;

                  nodeMesh.geometry.computeBoundingBox();
                  bboxParent = nodeMesh.geometry.boundingBox;
                  labelRightPadding = 0.1;
                  boxWidth =  Math.abs(bboxParent.max.x) + 
                    Math.abs(bboxParent.min.x) - logoSize.width - 
                    logoLeftPadding + labelRightPadding;                

                  // upper scaling factor
                  i = 1.0;
                  // until text fits into the parent bounding box
                  while ((textWidth > boxWidth) && (i > 0.1)) {    
                     // TODO time complexity: linear -> Do binary search alike approach                         
                    i -= 0.1;
                    labelGeo.scale(i, i, i);
                    // update the BoundingBox
                    labelGeo.computeBoundingBox();
                    bboxText = labelGeo.boundingBox;
                    textWidth = bboxText.max.x - bboxText.min.x;
                  }

                  // center position
                  var labelBottomPadding = 0.1;
                  posX = -textWidth / 2.0;
                  var posY = bboxParent.min.y + labelBottomPadding;

                  material = new THREE.MeshBasicMaterial({color: 0xffffff});

                  labelMesh = new THREE.Mesh(labelGeo, material);

                  labelMesh.position.set(posX, posY, 0);

                  nodeMesh.add(labelMesh);


                  //

                  labelGeo = new THREE.TextGeometry(
                    system.get('name'),
                    {
                      font: font,
                      size: 0.1,
                      height: 0
                    }
                  );
                  
                  labelGeo.computeBoundingBox();
                  bboxText = labelGeo.boundingBox;
                  textWidth = bboxText.max.x - bboxText.min.x;

                  systemMesh.geometry.computeBoundingBox();
                  bboxParent = systemMesh.geometry.boundingBox;
                  labelRightPadding = 0.1;
                  boxWidth =  Math.abs(bboxParent.max.x) + 
                    Math.abs(bboxParent.min.x) - logoSize.width - 
                    logoLeftPadding + labelRightPadding;                

                  // upper scaling factor
                  i = 1.0;
                  // until text fits into the parent bounding box
                  while ((textWidth > boxWidth) && (i > 0.1)) {    
                     // TODO time complexity: linear -> Do binary search alike approach                         
                    i -= 0.1;
                    labelGeo.scale(i, i, i);
                    // update the BoundingBox
                    labelGeo.computeBoundingBox();
                    bboxText = labelGeo.boundingBox;
                    textWidth = bboxText.max.x - bboxText.min.x;
                  }

                  // center position
                  labelBottomPadding = 0.3;
                  posX = -textWidth / 2.0;
                  posY = bboxParent.max.y - labelBottomPadding;

                  material = new THREE.MeshBasicMaterial({color: 0x00000});

                  labelMesh = new THREE.Mesh(labelGeo, material);

                  labelMesh.position.set(posX, posY, 0);

                  systemMesh.add(labelMesh);

              });              

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