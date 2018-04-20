import Object from '@ember/object';
import THREE from "npm:three";

export default Object.extend({

  textLabels: {},

  systemTextCache: [],
  nodeTextCache: [],
  appTextCache: [],

  font: null,

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
    this.drawNodeTextLabels();
    this.drawAppTextLabels();

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

      let labelMesh = this.isLabelAlreadyCreated(emberModel);

      if(labelMesh && labelMesh.mesh) {
        // update meta-info for model
        labelMesh.mesh.userData['model'] = emberModel;
        threejsModel['label'] = labelMesh.mesh;
        threejsModel.add(labelMesh.mesh);
        labelMesh = labelMesh.mesh;

      }
      else {
        const labelGeo = new THREE.TextBufferGeometry(textObj.text, {
          font: self.get('font'),
          size: 0.4,
          height: 0
        });

        const material = new THREE.MeshBasicMaterial({
          color: textObj.color
        });

        labelMesh = new THREE.Mesh(labelGeo, material);

        labelMesh.userData['type'] = 'label';
        labelMesh.userData['model'] = emberModel;

        self.get('textLabels')[emberModel.get('id')] =
          {"mesh": labelMesh};

        threejsModel['label'] = labelMesh;
        threejsModel.add(labelMesh);
      }

      this.repositionSystemLabel(labelMesh);
    });
  },


  drawNodeTextLabels() {

    const self = this;

    this.get('nodeTextCache').forEach((textObj) => {

      const threejsModel = textObj.parent;
      const emberModel = threejsModel.userData.model;

      let labelMesh = this.isLabelAlreadyCreated(emberModel);

      const nodegroupstate = emberModel.get('parent.opened');

      if(labelMesh && labelMesh.mesh &&
        labelMesh.nodegroupopenstate === nodegroupstate) {
        // update meta-info for model
        labelMesh.mesh.userData['model'] = emberModel;
        threejsModel['label'] = labelMesh.mesh;
        threejsModel.add(labelMesh.mesh);
        labelMesh = labelMesh.mesh;

      }
      else {
        const text = emberModel.getDisplayName();
        textObj.text = text;

        const labelGeo = new THREE.TextBufferGeometry(text, {
          font: self.get('font'),
          size: 0.22,
          height: 0
        });

        const material = new THREE.MeshBasicMaterial({
          color: textObj.color
        });

        labelMesh = new THREE.Mesh(labelGeo, material);

        labelMesh.userData['type'] = 'label';
        labelMesh.userData['model'] = emberModel;

        self.get('textLabels')[emberModel.get('id')] =
          {"mesh": labelMesh, "nodegroupopenstate": emberModel.get('parent.opened')};

        threejsModel['label'] = labelMesh;
        threejsModel.add(labelMesh);
      }

      this.repositionNodeLabel(labelMesh);
    });
  },



  drawAppTextLabels() {

    const self = this;

    this.get('appTextCache').forEach((textObj) => {

      const threejsModel = textObj.parent;
      const emberModel = threejsModel.userData.model;

      let labelMesh = this.isLabelAlreadyCreated(emberModel);

      if(labelMesh && labelMesh.mesh) {
        // update meta-info for model
        labelMesh.mesh.userData['model'] = emberModel;
        threejsModel['label'] = labelMesh.mesh;
        threejsModel.add(labelMesh.mesh);
        labelMesh = labelMesh.mesh;

      }
      else {
        const labelGeo = new THREE.TextBufferGeometry(textObj.text, {
          font: self.get('font'),
          size: 0.25,
          height: 0
        });

        const material = new THREE.MeshBasicMaterial({
          color: textObj.color
        });

        labelMesh = new THREE.Mesh(labelGeo, material);

        labelMesh.userData['type'] = 'label';
        labelMesh.userData['model'] = emberModel;

        self.get('textLabels')[emberModel.get('id')] =
          {"mesh": labelMesh};

        threejsModel['label'] = labelMesh;
        threejsModel.add(labelMesh);

      }

      this.repositionAppLabel(labelMesh);
    });
  },


  repositionSystemLabel(labelMesh) {

    const parent = labelMesh.parent;

    parent.geometry.computeBoundingBox();
    const bboxParent = parent.geometry.boundingBox;

    labelMesh.geometry.computeBoundingBox();
    const labelBoundingBox = labelMesh.geometry.boundingBox;

    const labelLength = Math.abs(labelBoundingBox.max.x) -
      Math.abs(labelBoundingBox.min.x);

    const yOffset = 0.6;

    labelMesh.position.x = - (labelLength / 2.0);
    labelMesh.position.y = bboxParent.max.y - yOffset;
    labelMesh.position.z = parent.position.z + 0.001;

  },


  repositionNodeLabel(labelMesh) {

    const parent = labelMesh.parent;

    parent.geometry.computeBoundingBox();
    const bboxParent = parent.geometry.boundingBox;

    labelMesh.geometry.computeBoundingBox();
    const labelBoundingBox = labelMesh.geometry.boundingBox;

    const labelLength = Math.abs(labelBoundingBox.max.x) -
      Math.abs(labelBoundingBox.min.x);

    const yOffset = 0.2;

    labelMesh.position.x = - (labelLength / 2.0);
    labelMesh.position.y = bboxParent.min.y + yOffset;
    labelMesh.position.z = parent.position.z + 0.001;

  },


  repositionAppLabel(labelMesh) {

    const parent = labelMesh.parent;

    parent.geometry.computeBoundingBox();
    const bboxParent = parent.geometry.boundingBox;

    labelMesh.geometry.computeBoundingBox();
    const labelBoundingBox = labelMesh.geometry.boundingBox;

    const labelHeight = Math.abs(labelBoundingBox.max.y) -
      Math.abs(labelBoundingBox.min.y);

    const xOffset = 0.1;

    labelMesh.position.x = bboxParent.min.x + xOffset;
    labelMesh.position.y = -(labelHeight / 2.0);
    labelMesh.position.z = parent.position.z + 0.001;

  },



  isLabelAlreadyCreated(emberModel) {

    // label already created and color didn't change?
    if(this.get('textLabels')[emberModel.get('id')] &&
      !this.get('configuration.landscapeColors.textchanged')) {

      const oldTextLabelObj =
        this.get('textLabels')[emberModel.get('id')];

      return oldTextLabelObj;
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
