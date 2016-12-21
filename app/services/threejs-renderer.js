import Ember from 'ember';

export default Ember.Service.extend({

  scene : null,
  renderer: null,
  camera: null,

  init() {
    this._super(...arguments);

    console.log("init");

    this.set('scene', new THREE.Scene());
    this.set('scene.background', new THREE.Color(0xffffff));
  },

  updateWindowSize(width, height, canvas) {

    if(!this.get('renderer')) {
      this.set('camera', new THREE.PerspectiveCamera(70, width / height, 1, 10));
      this.get('camera').position.set(13, -2, 10);

      this.set('renderer', new THREE.WebGLRenderer({
        antialias: true,  
        canvas: canvas
      }));
      this.get('renderer').setSize(width, height);
    }    

    const self = this;

    function render() {
      requestAnimationFrame(render); 
      self.get('renderer').render(self.get('scene'), self.get('camera'));
    }

    render();
  },

  renderLandscape(landscape) {

    const self = this;

    const systems = landscape.get('systems'); 

    const scaleFactor = {width: 0.5, height: 0.5};

    if(systems) {
      systems.forEach(function(system) {

        const{x, y, z} = system.get('backgroundColor');

        var extensionX = system.get('width') * scaleFactor.width;
        var centerX = system.get('positionX') + extensionX;

        var extensionY = system.get('height') * scaleFactor.height;
        var centerY = system.get('positionY') - extensionY;

        const systemMesh = addPlane(centerX, centerY, 0, system.get('width'), 
          system.get('height'), new THREE.Color(x,y,z), null, self.get('scene'), system);

        system.set('threeJSModel', systemMesh);

        const nodegroup = system.get('nodegroups');

        nodegroup.forEach(function(nodegroup) {

          const nodes = nodegroup.get('nodes');

          nodes.forEach(function(node) {

            const{x, y, z} = node.get('color');

            extensionX = node.get('width') * scaleFactor.width;
            extensionY = node.get('height') * scaleFactor.height;

            centerX = node.get('positionX') + extensionX;          
            centerY = node.get('positionY') - extensionY;

            const nodeMesh = addPlane(centerX, centerY, 0, node.get('width'), 
              node.get('height'), new THREE.Color(x,y,z), null, self.get('scene'), node);

            node.set('threeJSModel', nodeMesh);  

            const applications = node.get('applications');

            applications.forEach(function(application) {

              const{x, y, z} = application.get('backgroundColor'); 

              extensionX = application.get('width') * scaleFactor.width;
              extensionY = application.get('height') * scaleFactor.width;

              centerX = application.get('positionX') + extensionX - 0;          
              centerY = application.get('positionY') - extensionY - 0;

              const applicationMesh = addPlane(centerX, centerY, 0, 
                application.get('width'), application.get('height'), 
                new THREE.Color(x,y,z), null, self.get('scene'), application);

              application.set('threeJSModel', applicationMesh);

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
                texturePartialPath, applicationMesh, "label");

              new THREE.FontLoader().load('three.js/fonts/helvetiker_regular.typeface.json', 
                (font) => {

                  var padding = {left: 0.0, right: -logoLeftPadding, top: 0.0, bottom: 0.0};
                  var labelMesh = createLabel(font, 0.2, null, applicationMesh, 
                    padding, 0xffffff, logoSize, "center"); 

                  applicationMesh.add(labelMesh);

                  padding = {left: 0.0, right: 0.0, top: 0.0, bottom: 0.2};
                  labelMesh = createLabel(font, 0.125, node.get('ipAddress'), nodeMesh, 
                    padding, 0xffffff, {width: 0.0, height: 0.0}, "min"); 

                  nodeMesh.add(labelMesh);

                  padding = {left: 0.0, right: 0.0, top: -0.4, bottom: 0.0};
                  labelMesh = createLabel(font, 0.2, null, systemMesh, 
                    padding, 0x00000, {width: 0.0, height: 0.0}, "max");                  

                  systemMesh.add(labelMesh);

              });              

            }); 

          });
          
        });

      });
    }

    // Communication

    const appCommunication = landscape.get('applicationCommunication');     

    if(appCommunication) {
      appCommunication.forEach((communication) => {
        // TODO Why not working?
        console.log("communication", communication);
      });
    }

    function createLabel(font, size, textToShow, parent, padding, color, logoSize, yPosition) {

      const text = textToShow ? textToShow : 
        parent.userData.model.get('name');

      const labelGeo = new THREE.TextGeometry(
        text,
        {
          font: font,
          size: size,
          height: 0
        }
      );

      labelGeo.computeBoundingBox();
      var bboxLabel = labelGeo.boundingBox;
      var labelWidth = bboxLabel.max.x - bboxLabel.min.x;

      parent.geometry.computeBoundingBox();
      const bboxParent = parent.geometry.boundingBox;

      var boxWidth =  Math.abs(bboxParent.max.x) + 
        Math.abs(bboxParent.min.x) - logoSize.width +
        padding.left + padding.right;   

      // upper scaling factor
      var i = 1.0;

      // scale until text fits into parent bounding box
      while ((labelWidth > boxWidth) && (i > 0.1)) {    
         // TODO time complexity: linear -> Do binary search alike approach                         
        i -= 0.1;
        labelGeo.scale(i, i, i);
        // update the boundingBox
        labelGeo.computeBoundingBox();
        bboxLabel = labelGeo.boundingBox;
        labelWidth = bboxLabel.max.x - bboxLabel.min.x;
      }

      const posX = (-labelWidth / 2.0) + padding.left + padding.right;

      var posY = padding.bottom + padding.top;

      if(yPosition === "max") {
        posY += bboxParent.max.y;
      } 
      else if(yPosition === "min") {
        posY += bboxParent.min.y;
      }

      const material = new THREE.MeshBasicMaterial({color: color});

      const labelMesh = new THREE.Mesh(labelGeo, material);

      labelMesh.position.set(posX, posY, 0);

      return labelMesh;
    }

    function addPlane(x, y, z, width, height, color, texture, parent, model) {

      if(texture) {
         
         new THREE.TextureLoader().load('images/logos/' + texture + '.png', (texture) => {
            const material = new THREE.MeshBasicMaterial({map: texture, transparent: true});
            const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), 
             material);
            plane.position.set(x, y, z);
            parent.add(plane);
            plane.userData['model'] = model;
            return plane;
          });   

        
      } else {

        const material = new THREE.MeshBasicMaterial({color: color});
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), 
          material);
        plane.position.set(x, y, z);
        parent.add(plane);
        plane.userData['model'] = model;
        return plane;
      }

      
    }
  }

});
