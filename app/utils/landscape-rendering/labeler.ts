import Object from '@ember/object';
import THREE from "three";
import System from 'explorviz-frontend/models/system';
import Node from 'explorviz-frontend/models/node';
import NodeGroup from 'explorviz-frontend/models/nodegroup';

export default Object.extend({

  textLabels: new Map(),

  // Set as this object is created
  configuration: null,


  init() {
    this._super(...arguments);

    this.set('textLabels', new Map());
  },


  drawSystemTextLabel(threejsModel: any, font: THREE.Font) {
    let configuration: any = this.get('configuration');
    let color: string = configuration.get('landscapeColors.systemText');
    let emberModel: System = threejsModel.userData.model;
    let text = emberModel.get('name');

    let labelMesh = this.drawTextLabel(threejsModel, text, font, 0.4, color);
    this.repositionLabel(labelMesh, -0.6);
  },


  drawNodeTextLabel(threejsModel: any, font: THREE.Font) {
    let configuration: any = this.get('configuration');
    let color: string = configuration.get('landscapeColors.nodeText');
    let emberModel: Node = threejsModel.userData.model;
    let text = emberModel.getDisplayName();

    if (threejsModel.userData['nodegroupopenstate'] !== emberModel.parent.get('opened')) {
      let textLabels: Map<string, any> = this.get('textLabels');
      textLabels.delete(emberModel.get('id'));
    }

    let labelMesh = this.drawTextLabel(threejsModel, text, font, 0.22, color);
    labelMesh.userData['nodegroupopenstate'] = emberModel.parent.get('opened');
    this.repositionLabel(labelMesh, 0.2);
  },


  drawApplicationTextLabel(threejsModel: any, font: THREE.Font) {
    let configuration: any = this.get('configuration');
    let color: string = configuration.get('landscapeColors.applicationText');
    let emberModel: System = threejsModel.userData.model;
    let text = emberModel.get('name');

    let labelMesh = this.drawTextLabel(threejsModel, text, font, 0.25, color);
    this.repositionAppLabel(labelMesh);
  },


  drawTextLabel(threejsModel: any, text: string, font: THREE.Font, fontSize: number, color: string) {
    let emberModel: any = threejsModel.userData.model;
    let labelMesh: any = this.isLabelAlreadyCreated(emberModel);

    if (labelMesh) {
      // Update meta-info for model
      this.updateLabelData(labelMesh, emberModel, text);
      threejsModel.add(labelMesh);
    }
    else {
      const labelGeo = new THREE.TextBufferGeometry(text, {
        font,
        size: fontSize,
        height: 0
      });

      const material = new THREE.MeshBasicMaterial({
        color
      });

      labelMesh = new THREE.Mesh(labelGeo, material);

      this.updateLabelData(labelMesh, emberModel, text);

      threejsModel.add(labelMesh);
    }

    return labelMesh;
  },


  updateLabelData(labelMesh: THREE.Mesh, emberModel: any, text: string) {
    labelMesh.name = text;
    labelMesh.userData['type'] = 'label';
    labelMesh.userData['model'] = emberModel;

    let textLabels: any = this.get('textLabels');
    textLabels.set(emberModel.get('id'), labelMesh);

    // TODO: Is this property used?
    if (labelMesh.parent)
      labelMesh.parent.userData['label'] = labelMesh;
  },


  repositionLabel(labelMesh: THREE.Mesh, offset: number) {
    const parent = labelMesh.parent as THREE.Mesh;
    if (!parent) {
      return;
    }

    parent.geometry.computeBoundingBox();
    const bboxParent = parent.geometry.boundingBox;

    labelMesh.geometry.computeBoundingBox();
    const labelBoundingBox = labelMesh.geometry.boundingBox;

    const labelLength = Math.abs(labelBoundingBox.max.x) -
      Math.abs(labelBoundingBox.min.x);

    labelMesh.position.x = - (labelLength / 2.0);

    if (labelMesh.userData.model instanceof System) {
      labelMesh.position.y = bboxParent.max.y + offset;
    } else {
      labelMesh.position.y = bboxParent.min.y + offset;
    }

    labelMesh.position.z = parent.position.z + 0.001;
  },


  repositionAppLabel(labelMesh: THREE.Mesh) {
    const parent = labelMesh.parent as THREE.Mesh;

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

  drawCollapseSymbol(mesh: THREE.Mesh, font: THREE.Font) {
    // Add respective open / close symbol
    mesh.geometry.computeBoundingBox();
    let emberModel: System | NodeGroup = mesh.userData.model;
    const bboxSystem = mesh.geometry.boundingBox;

    let collapseSymbol = null;

    if (emberModel.opened) {
      collapseSymbol = this.createCollapseSymbols('+', 0.35, font);
    } else {
      collapseSymbol = this.createCollapseSymbols('-', 0.35, font);
    }

    if (collapseSymbol) {
      collapseSymbol.position.x = bboxSystem.max.x - 0.35;
      collapseSymbol.position.y = bboxSystem.max.y - 0.35;
      collapseSymbol.position.z = mesh.position.z + 0.0001;
      mesh.add(collapseSymbol);
    }
  },


  createCollapseSymbols(label: string, size: number, font: THREE.Font) {
    let configuration: any = this.get('configuration');

    if (!configuration)
      return;

    const material = new THREE.MeshBasicMaterial({
      color: configuration.get('landscapeColors.collapseSymbol')
    });


    const collapseGeometry = new THREE.TextBufferGeometry(label, {
      font,
      size,
      height: 0
    });

    const collapseMesh = new THREE.Mesh(collapseGeometry, material);

    return collapseMesh;
  },


  isLabelAlreadyCreated(emberModel: any) {
    let textLabels: any = this.get('textLabels');

    if (textLabels === null)
      return null;

    let labelMesh: any = textLabels.get(emberModel.get('id'));

    // Label exists and text + text color did not change?
    if (labelMesh && labelMesh.name === emberModel.get('name')) {
      return labelMesh;
    } else {
      return null;
    }
  },

});