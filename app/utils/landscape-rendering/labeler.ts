import Object from '@ember/object';
import THREE from "three";

export default Object.extend({

  textLabels: null,

  systemTextCache: null,
  nodeTextCache: null,
  appTextCache: null,

  font: null,
  configuration: null,

  init() {
    this._super(...arguments);

    this.set('textLabels', {});
    this.set('systemTextCache', []);
    this.set('nodeTextCache', []);
    this.set('appTextCache', []);
  },
 
  saveTextForLabeling(textToShow: string | null, parent: THREE.Mesh, color: string): void {
    const emberModelName = parent.userData.model.constructor.modelName;
    const text = textToShow ? textToShow : parent.userData.model.get('name');

    let textCache: any = null;

    if (emberModelName === "system") {
      textCache = this.get('systemTextCache');
    }
    else if (emberModelName === "node") {
      textCache = this.get('nodeTextCache');
    }
    else if (emberModelName === "application") {
      textCache = this.get('appTextCache');
    }

    if (textCache) {
      textCache.push({ text: text, parent: parent, color: color });
    }
  },


  drawTextLabels(font: THREE.Font, configuration: any) {
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
    let systemTextCache: any = this.get('systemTextCache');
    if (!systemTextCache) {
      return;
    }

    systemTextCache.forEach((textObj: { text: string, parent: THREE.Mesh, color: string }) => {
      const threejsModel:any = textObj.parent;
      const emberModel = threejsModel.userData.model;

      let labelMesh:any = this.isLabelAlreadyCreated(emberModel);

      if (labelMesh && labelMesh.mesh) {
        // Update meta-info for model
        labelMesh.mesh.userData['model'] = emberModel;
        threejsModel['label'] = labelMesh.mesh;
        threejsModel.add(labelMesh.mesh);
        labelMesh = labelMesh.mesh;
      }
      else {
        let font: any = this.get('font');

        const labelGeo = new THREE.TextBufferGeometry(textObj.text, {
          font,
          size: 0.4,
          height: 0
        });

        const material = new THREE.MeshBasicMaterial({
          color: textObj.color
        });

        labelMesh = new THREE.Mesh(labelGeo, material);

        labelMesh.name = emberModel.get('name');
        labelMesh.userData['type'] = 'label';
        labelMesh.userData['model'] = emberModel;

        let textLabels: any = this.get('textLabels');
        textLabels[emberModel.get('id')] =
          { "mesh": labelMesh };

        threejsModel['label'] = labelMesh;
        threejsModel.add(labelMesh);
      }

      this.repositionSystemLabel(labelMesh);
    });
  },


  drawNodeTextLabels() {
    let nodeTextCache: any = this.get('nodeTextCache');
    nodeTextCache.forEach((textObj : { text: string, parent: THREE.Mesh, color: string }) => {
      const threejsModel:any = textObj.parent;
      const emberModel = threejsModel.userData.model;
      const nodegroupstate = emberModel.get('parent.opened');

      let labelMesh:any = this.isLabelAlreadyCreated(emberModel);

      if (labelMesh && labelMesh.mesh &&
        labelMesh.nodegroupopenstate === nodegroupstate) {
        // Update meta-info for model
        labelMesh.mesh.userData['model'] = emberModel;
        threejsModel['label'] = labelMesh.mesh;
        threejsModel.add(labelMesh.mesh);
        labelMesh = labelMesh.mesh;
      }
      else {
        const text = emberModel.getDisplayName();
        textObj.text = text;

        let font: any = this.get('font');
        const labelGeo = new THREE.TextBufferGeometry(text, {
          font,
          size: 0.22,
          height: 0
        });

        const material = new THREE.MeshBasicMaterial({
          color: textObj.color
        });

        labelMesh = new THREE.Mesh(labelGeo, material);

        labelMesh.name = emberModel.get('name');
        labelMesh.userData['type'] = 'label';
        labelMesh.userData['model'] = emberModel;

        let textLabels : any = this.get('textLabels');
        textLabels[emberModel.get('id')] =
          { "mesh": labelMesh, "nodegroupopenstate": emberModel.get('parent.opened') };

        threejsModel['label'] = labelMesh;
        threejsModel.add(labelMesh);
      }

      this.repositionNodeLabel(labelMesh);
    });
  },



  drawAppTextLabels() {
    let appTextCache : any = this.get('appTextCache');
    appTextCache.forEach((textObj : { text: string, parent: THREE.Object3D, color: string }) => {

      const threejsModel:any = textObj.parent;
      const emberModel = threejsModel.userData.model;

      let labelMesh:any = this.isLabelAlreadyCreated(emberModel);

      if (labelMesh && labelMesh.mesh) {
        // Update meta-info for model
        labelMesh.mesh.userData['model'] = emberModel;
        threejsModel['label'] = labelMesh.mesh;
        threejsModel.add(labelMesh.mesh);
        labelMesh = labelMesh.mesh;
      }
      else {
        let font : any = this.get('font');
        const labelGeo = new THREE.TextBufferGeometry(textObj.text, {
          font,
          size: 0.25,
          height: 0
        });

        const material = new THREE.MeshBasicMaterial({
          color: textObj.color
        });

        labelMesh = new THREE.Mesh(labelGeo, material);
        
        labelMesh.name = emberModel.get('name');
        labelMesh.userData['type'] = 'label';
        labelMesh.userData['model'] = emberModel;

        let textLabels : any = this.get('textLabels');
        textLabels[emberModel.get('id')] =
          { "mesh": labelMesh };

        threejsModel['label'] = labelMesh;
        threejsModel.add(labelMesh);
      }

      this.repositionAppLabel(labelMesh);
    });
  },


  repositionSystemLabel(labelMesh : THREE.Mesh) {
    const parent = labelMesh.parent  as THREE.Mesh;
    if (!parent) {
      return;
    }

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


  repositionNodeLabel(labelMesh : THREE.Mesh) {
    const parent = labelMesh.parent as THREE.Mesh;

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


  repositionAppLabel(labelMesh : THREE.Mesh) {
    const parent = labelMesh.parent  as THREE.Mesh;

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

  isLabelAlreadyCreated(emberModel:any) {
    let textLabels = this.get('textLabels');

    if(textLabels === null)
      return null;

    let potentialLabel:any = textLabels[emberModel.get('id')];

    let configuration:any = this.get('configuration');
    // Label exists and text + text color did not change?
    if (potentialLabel && potentialLabel.mesh.name === emberModel.get('name') &&
      (!configuration || !configuration.get('landscapeColors.textchanged'))) {
      const oldTextLabelObj =
      textLabels[emberModel.get('id')];

      return oldTextLabelObj;
    } else {
      return null;
    }
  },

});