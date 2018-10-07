import Object from '@ember/object';
import THREE from "three";
import { shortenString } from '../helpers/string-helpers';

export default Object.extend({

  labels: null,

  textMaterialWhite: null,

  textMaterialBlack: null,

  init() {
    this._super(...arguments);

    this.set('labels', []);

    this.set('textMaterialWhite', 
      new THREE.MeshBasicMaterial({
        color : 0xffffff
      })
    );

    this.set('textMaterialBlack', 
      new THREE.MeshBasicMaterial({
        color : 0x000000
      })
    );

  },

  createLabel(parentMesh, parentObject, font, transparent) {

    const bboxNew = new THREE.Box3().setFromObject(parentMesh);

    const worldParent = new THREE.Vector3();
    worldParent.setFromMatrixPosition(parentMesh.matrixWorld);

    const oldLabel = this.get('labels').filter(function(label) {
      const data = label.userData;

      return data.name === parentMesh.userData.name &&
      label.userData.parentPos.equals(worldParent);
    });

    // check if TextGeometry already exists
    if (oldLabel && oldLabel[0]) {

      // check if transparency changed, therefore requires an update
      if(transparent && !oldLabel[0].material.transparent) {
        const newMaterial = oldLabel[0].material.clone();
        newMaterial.transparent = true;
        newMaterial.opacity = 0.4;
        oldLabel[0].material = newMaterial;
      } 
      else if(!transparent && oldLabel[0].material.transparent){
        const newMaterial = oldLabel[0].material.clone();
        newMaterial.transparent = false;
        newMaterial.opacity = 1;
        oldLabel[0].material = newMaterial;
      }

      parentObject.add(oldLabel[0]);
      return;
    }

    // new TextGeometry necessary
    else {

      let fontSize = 2;

      let labelString = parentMesh.userData.name;

      if(parentMesh.userData.type === 'clazz' && labelString.length > 10){
        labelString = shortenString(labelString);
      }

      var textGeo = new THREE.TextGeometry(labelString, {
        font : font,
        size : fontSize,
        height : 0.1,
        curveSegments : 1
      });

      // font color depending on parent object
      let material;
      if (parentMesh.userData.foundation) {
        material = this.get('textMaterialBlack');
      }
      else if (parentMesh.userData.type === 'package') {
        material = this.get('textMaterialWhite');
      }
      // class
      else {
        material = this.get('textMaterialWhite');
      }      

      var mesh = new THREE.Mesh(textGeo, material);



      // calculate textWidth
      textGeo.computeBoundingBox();
      var bboxText = textGeo.boundingBox;
      var textWidth = bboxText.max.x - bboxText.min.x;

      // calculate boundingbox for (centered) positioning
      parentMesh.geometry.computeBoundingBox();
      var bboxParent = parentMesh.geometry.boundingBox;
      var boxWidth = bboxParent.max.x;

      // static size for class text
      if (parentMesh.userData.type === 'clazz') {
        // static scaling factor
        var j = 0.3;
        textGeo.scale(j, j, j);
      }
      // shrink the text if necessary to fit into the box
      else {
        // upper scaling factor
        var i = 1.0;
        // until text fits into the parent bounding box
        while ((textWidth > boxWidth) && (i > 0.1)) {
          textGeo.scale(i, i, i);
          i -= 0.1;
          // update the BoundingBoxes
          textGeo.computeBoundingBox();
          bboxText = textGeo.boundingBox;
          textWidth = bboxText.max.x - bboxText.min.x;
          parentMesh.geometry.computeBoundingBox();
          bboxParent = parentMesh.geometry.boundingBox;
          boxWidth = bboxParent.max.x;
        }
      }

      // calculate center for postioning
      textGeo.computeBoundingSphere();
      var centerX = textGeo.boundingSphere.center.x;

      // set position and rotation
      if (parentMesh.userData.opened) {
        mesh.position.x = bboxNew.min.x + 2;
        mesh.position.y = bboxNew.max.y;
        mesh.position.z = (worldParent.z - Math.abs(centerX) / 2) - 2;
        mesh.rotation.x = -(Math.PI / 2);
        mesh.rotation.z = -(Math.PI / 2);
      } else {
        // TODO fix 'perfect' centering
        if (parentMesh.userData.type === 'clazz') {
          mesh.position.x = worldParent.x - Math.abs(centerX) / 2 - 0.25;
          mesh.position.y = bboxNew.max.y;
          mesh.position.z = (worldParent.z - Math
              .abs(centerX) / 2) - 0.25;
          mesh.rotation.x = -(Math.PI / 2);
          mesh.rotation.z = -(Math.PI / 3);
        } else {
          mesh.position.x = worldParent.x - Math.abs(centerX) / 2;
          mesh.position.y = bboxNew.max.y;
          mesh.position.z = worldParent.z - Math.abs(centerX) / 2;
          mesh.rotation.x = -(Math.PI / 2);
          mesh.rotation.z = -(Math.PI / 4);
        }
      }

      // internal user-defined type
      mesh.userData = {
        type : 'label',
        name : parentMesh.userData.name,
        parentPos : worldParent
      };

      // add to scene
      //self.combinedMeshes.push(mesh);
      //mesh.add(mesh);
      this.get('labels').push(mesh);
      parentObject.add(mesh);

      //return textMesh;

    }

  }

});
