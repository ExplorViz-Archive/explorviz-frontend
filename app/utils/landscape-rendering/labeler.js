import Ember from 'ember';
import THREE from "npm:three";

export default Ember.Object.extend({

  textLabels: {},

  systemTextCache: [],
  nodeTextCache: [],
  appTextCache: [],

  font: null,

  textMaterialWhite: new THREE.MeshBasicMaterial({
    color : 0xffffff
  }),

  textMaterialBlack: new THREE.MeshBasicMaterial({
    color : 0x000000
  }),


  saveTextForLabeling(textToShow, parent, color) {

    const emberModelName = parent.userData.model.constructor.modelName;
    const text = textToShow ? textToShow : parent.userData.model.get('name');

    let textCache = 'systemTextCache';

    if(emberModelName === "node"){
      textCache = 'nodeTextCache';
    }
    else if(emberModelName === "application") {
      textCache = 'appTextCache';
    }

    this.get(textCache).push({text: text, parent: parent, color: color});
  },


  drawTextLabels(font, configuration) {

    this.set('font', font);
    this.set('configuration', configuration);

    this.drawSystemTextLabels();

    // After drawing, reset all caches for next tick
    this.set('systemTextCache', []);
    this.set('nodeTextCache', []);
    this.set('appTextCache', []);

  },


  drawSystemTextLabels() {

    const self = this;

    this.get('systemTextCache').forEach((textObj) => {

      const threejsModel = textObj.parent;
      const emberModel = threejsModel.userData.model;

      const maybeLabel = this.isLabelAlreadyCreated(emberModel);

      if(maybeLabel) {
        //console.log("old label");
        // update meta-info for model
        maybeLabel.userData['model'] = emberModel;  
        threejsModel.add(maybeLabel);
        return;
      }

      //console.log("new label");

      const labelGeo = new THREE.TextBufferGeometry(textObj.text, {
        font: self.get('font'),
        size: 0.3,
        height: 0
      });

      const material = new THREE.MeshBasicMaterial({
        color: textObj.color
      });

      const labelMesh = new THREE.Mesh(labelGeo, material);



      threejsModel.geometry.computeBoundingBox();
      const bboxParent = threejsModel.geometry.boundingBox;

      /*const boxWidth = Math.abs(bboxParent.max.x) +
        Math.abs(bboxParent.min.x);

      var boxHeigth = Math.abs(bboxParent.max.y) +
        Math.abs(bboxParent.min.y);*/
    
      
      // POSITIONING (relative to parent, e.g. 0 = center of parent)

      labelMesh.geometry.computeBoundingBox();
      const labelBoundingBox = labelMesh.geometry.boundingBox;
      
      const labelLength = Math.abs(labelBoundingBox.max.x) - 
        Math.abs(labelBoundingBox.min.x);

      const yOffset = 0.6;

      labelMesh.position.x = - (labelLength / 2.0);
      labelMesh.position.y = bboxParent.max.y - yOffset;

      labelMesh.position.z = 0.05;

      labelMesh.userData['type'] = 'label';
      labelMesh.userData['model'] = emberModel;      
      
      self.get('textLabels')[emberModel.get('id')] = 
        {"mesh": labelMesh, "state": emberModel.get('state')};

      threejsModel.add(labelMesh);

    });
  },


  createNodeTextLabels() {

  },


  createApplicationTextLabels() {

  },


  isLabelAlreadyCreated(emberModel) {

    // label already created and color didn't change?
    if(this.get('textLabels')[emberModel.get('id')] && 
      !this.get('configuration.landscapeColors.textchanged')) {

      // model state didn't change?
      if(this.get('textLabels')[emberModel.get('id')].state === 
        emberModel.get("state")) {

        const oldTextLabelMesh = 
          this.get('textLabels')[emberModel.get('id')].mesh;

        return oldTextLabelMesh;
      }        
    }

    return null;
  },


  findLongestTextLabel(labelStrings) {
    let longestString = "";

    labelStrings.map(function(obj){

      if(obj.text.length >= longestString.length) {
        //console.log(obj.text);
        longestString = obj.text;
      }
    });

    return longestString;

  }

});