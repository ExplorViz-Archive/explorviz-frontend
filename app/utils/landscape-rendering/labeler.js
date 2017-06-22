import Ember from 'ember';
import THREE from "npm:three";

export default Ember.Object.extend({

  textLabels: {},

  textCache: [],

  textMaterialWhite: new THREE.MeshBasicMaterial({
    color : 0xffffff
  }),

  textMaterialBlack: new THREE.MeshBasicMaterial({
    color : 0x000000
  }),

  saveTextForLabeling(textToShow, parent, color) {
    const text = textToShow ? textToShow : parent.userData.model.get('name');
    this.get('textCache').push({text: text, parent: parent, color: color});
  },

  createTextLabels(font) {

    this.get('textCache').forEach((textObj) => {

      const labelGeo = new THREE.TextGeometry(textObj.text, {
        font: font,
        size: 0.2,
        height: 0
      });

      const material = new THREE.MeshBasicMaterial({
        color: textObj.color
      });

      const labelMesh = new THREE.Mesh(labelGeo, material);   

      textObj.parent.geometry.computeBoundingBox();
      const bboxParent = textObj.parent.geometry.boundingBox;

      const boxWidth = Math.abs(bboxParent.max.x) +
        Math.abs(bboxParent.min.x);

      var boxHeigth = Math.abs(bboxParent.max.y) +
        Math.abs(bboxParent.min.y);

      labelMesh.scale.set(boxWidth / 2, 1, 1);

      labelMesh.position.x = bboxParent.min.x;

      console.log(labelMesh.geometry.vertices);

      textObj.parent.add(labelMesh);


    });

  },

  createTextLabel(font, size, textToShow, parent, padding, color,
    logoSize, yPosition, model) {

    /*if(this.get('textLabels')[model.get('id')] && 
      !this.get('configuration.landscapeColors.textchanged')) {
      if(this.get('textLabels')[model.get('id')].state === model.get("state")) {
        //console.log("old label");
        return this.get('textLabels')[model.get('id')].mesh;
      }        
    }

    //console.log("new label");

    const text = textToShow ? textToShow : parent.userData.model.get('name');

    parent.geometry.computeBoundingBox();
    const bboxParent = parent.geometry.boundingBox;

    var boxWidth = Math.abs(bboxParent.max.x) +
      Math.abs(bboxParent.min.x);

    var boxHeigth = Math.abs(bboxParent.max.y) +
      Math.abs(bboxParent.min.y);

    let labelGeo = new THREE.TextBufferGeometry(text, {
          font: font,
          size: size,
          height: 0
    });

    let labelGeo2 = new THREE.TextGeometry(text, {
          font: font,
          size: size,
          height: 0
    });

    const material = new THREE.MeshBasicMaterial({
      color: color
    });

    const labelMesh = new THREE.Mesh(labelGeo, material);

    labelMesh.position.x = bboxParent.min.x;
    labelMesh.position.z = 0.005;

    //labelMesh.scale.set(boxWidth / 2, boxHeigth, 1);

    this.get('textLabels')[model.get('id')] = {"mesh": labelMesh, "state": model.get('state')};

    return labelMesh;*/

  }

});