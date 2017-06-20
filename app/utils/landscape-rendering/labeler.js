import Ember from 'ember';
import THREE from "npm:three";

export default Ember.Object.extend({

  textLabels: {},

  textMaterialWhite: new THREE.MeshBasicMaterial({
    color : 0xffffff
  }),

  textMaterialBlack: new THREE.MeshBasicMaterial({
    color : 0x000000
  }),

  createTextLabel(font, size, textToShow, parent, padding, color,
    logoSize, yPosition, model) {

    // TODO: Use DynamicTexture as texture map for plane mesh and add
    // this plane mesh to the actual model. Resizing should be easier then
    //var dynamicTexture  = new THREEx.DynamicTexture(512,512);

    const self = this;

    if(self.get('textLabels')[model.get('id')] && 
      !self.get('configuration.landscapeColors.textchanged')) {
      if(self.get('textLabels')[model.get('id')].state === model.get("state")) {
        //console.log("old label");
        return self.get('textLabels')[model.get('id')].mesh;
      }        
    }

    //console.log("new label");

    const text = textToShow ? textToShow :
      parent.userData.model.get('name');

    let labelGeo = new THREE.TextBufferGeometry( text, {
          font: font,
          size: size,
          height: 0
        });

    /*let labelGeo = new THREE.TextGeometry(
      text, {
        font: font,
        size: size,
        height: 0
      }
    );*/
   
    labelGeo.computeBoundingBox();
    var bboxLabel = labelGeo.boundingBox;
    var labelWidth = bboxLabel.max.x - bboxLabel.min.x;

    //console.log("label", text);

    //console.log("labelMax", bboxLabel.max.x);
    //console.log("labelMin", bboxLabel.min.x);
    //console.log("labelWidth", labelWidth);

    parent.geometry.computeBoundingBox();
    const bboxParent = parent.geometry.boundingBox;

    var boxWidth = Math.abs(bboxParent.max.x) +
      Math.abs(bboxParent.min.x);

    //console.log("pre-boxwidth", boxWidth);

    boxWidth = boxWidth - logoSize.width + padding.left + padding.right;

    //console.log("boxwidth", boxWidth);

    // We can't set the size of the labelGeo. Hence we need to scale it.

    // upper scaling factor
    var i = 1.0;

    // scale until text fits into parent bounding box
    while ((labelWidth > boxWidth) && (i > 0.1)) {
      // TODO time complexity: linear -> Do binary search alike approach?                        
      i -= 0.05;
      labelGeo.scale(i, i, i);
      // update the boundingBox
      labelGeo.computeBoundingBox();
      bboxLabel = labelGeo.boundingBox;
      labelWidth = bboxLabel.max.x - bboxLabel.min.x;
      if (text === "PostgreSQL") {
        //console.log("boxWidth", boxWidth);
        //console.log("labelWidth", labelWidth);
      }
    }

    const labelHeight = bboxLabel.max.y - bboxLabel.min.y;

    if (text === "PostgreSQL") {
      //console.log(labelHeight);
    }
    //console.log("labelHeight", labelHeight);

    let posX = (-labelWidth / 2.0) + padding.left + padding.right;

    let posY = padding.bottom + padding.top;

    if (yPosition === "max") {
      posY += bboxParent.max.y;
    } else if (yPosition === "min") {
      posY += bboxParent.min.y;
    } else if (yPosition === "center") {
      posY -= (labelHeight / 2.0);
    }

    const material = new THREE.MeshBasicMaterial({
      color: color
    });

    const labelMesh = new THREE.Mesh(labelGeo, material);

    labelMesh.position.set(posX, posY, 0.005);

    labelMesh.userData['type'] = 'label';
    labelMesh.userData['model'] = model;

    self.get('textLabels')[model.get('id')] = {"mesh": labelMesh, "state": model.get('state')};

    return labelMesh;
  }

});