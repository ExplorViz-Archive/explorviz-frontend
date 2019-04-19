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
        color: 0xffffff
      })
    );

    this.set('textMaterialBlack',
      new THREE.MeshBasicMaterial({
        color: 0x000000
      })
    );
  },

  createLabel(parentMesh, parentObject, font, transparent) {
    const bBoxParent = new THREE.Box3().setFromObject(parentMesh);

    const worldParent = new THREE.Vector3();
    worldParent.setFromMatrixPosition(parentMesh.matrixWorld);

    const oldLabel = this.get('labels').filter(function (label) {
      const data = label.userData;

      return data.name === parentMesh.userData.name &&
        label.userData.parentPos.equals(worldParent);
    });

    // Check if TextGeometry already exists
    if (oldLabel && oldLabel[0]) {
      // Check if transparency changed, therefore requires an update
      if (transparent && !oldLabel[0].material.transparent) {
        const newMaterial = oldLabel[0].material.clone();
        newMaterial.transparent = true;
        newMaterial.opacity = 0.4;
        oldLabel[0].material = newMaterial;
      }
      else if (!transparent && oldLabel[0].material.transparent) {
        const newMaterial = oldLabel[0].material.clone();
        newMaterial.transparent = false;
        newMaterial.opacity = 1;
        oldLabel[0].material = newMaterial;
      }

      parentObject.add(oldLabel[0]);
    }
    // New TextGeometry necessary
    else {
      let fontSize = 2;
      let labelString = parentMesh.userData.name;

      if (parentMesh.userData.type === 'clazz' && labelString.length > 10) {
        labelString = shortenString(labelString);
      }

      let textGeo = new THREE.TextGeometry(labelString, {
        font: font,
        size: fontSize,
        height: 0.1,
        curveSegments: 1
      });

      // Font color depending on parent object
      let material;
      if (parentMesh.userData.foundation) {
        material = this.get('textMaterialBlack').clone();
      }
      else if (parentMesh.userData.type === 'package') {
        material = this.get('textMaterialWhite').clone();
      }
      // Clazz
      else {
        material = this.get('textMaterialWhite').clone();
      }

      // Apply transparency / opacity
      if (transparent) {
        material.transparent = true;
        material.opacity = 0.4;
      }

      let textMesh = new THREE.Mesh(textGeo, material);

      // Calculate textWidth
      textGeo.computeBoundingBox();
      let bboxText = textGeo.boundingBox;
      let textBoxDimensions = new THREE.Vector3();
      bboxText.getSize(textBoxDimensions);
      let textWidth = textBoxDimensions.x;

      // Calculate boundingbox of parent mesh
      let bBoxDimension = new THREE.Vector3();
      bBoxParent.getSize(bBoxDimension);
      let boxWidth = bBoxDimension.z;

      // Static size for class text
      let margin = 0.5;
      if (parentMesh.userData.type === 'clazz') {
        // Static scaling factor
        let scaleFactor = 0.3;
        textGeo.scale(scaleFactor, scaleFactor, scaleFactor);
      }
      // Handle text which is too big for a component
      else if (textWidth > (boxWidth - margin)) {
        // Compute factor to fit text to parent (including small margin)
        let scaleFactor = (boxWidth - margin) / textWidth;
        textGeo.scale(scaleFactor, scaleFactor, scaleFactor);

        // Update text width data
        textGeo.computeBoundingBox();
        bboxText.getSize(textBoxDimensions);
        textWidth = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x; //textBoxDimensions.x;
      }

      // Calculate center for postioning
      textGeo.computeBoundingSphere();
      let centerX = textGeo.boundingSphere.center.x;

      // Set position and rotation
      if (parentMesh.userData.opened) {
        textMesh.position.x = bBoxParent.min.x + 2;
        textMesh.position.y = bBoxParent.max.y;
        // Center mesh
        textMesh.position.z = (bBoxParent.min.z + 0.5 * (boxWidth)) - 0.5 * textWidth;
        textMesh.rotation.x = -(Math.PI / 2);
        textMesh.rotation.z = -(Math.PI / 2);
      }
      else {
        if (parentMesh.userData.type === 'clazz') {
          textMesh.position.x = worldParent.x - Math.abs(centerX) / 2 - 0.25;
          textMesh.position.y = bBoxParent.max.y;
          textMesh.position.z = (worldParent.z - Math
            .abs(centerX) / 2) - 0.25;
          textMesh.rotation.x = -(Math.PI / 2);
          textMesh.rotation.z = -(Math.PI / 3);
        } else {
          textMesh.position.x = worldParent.x - Math.abs(centerX) / 2;
          textMesh.position.y = bBoxParent.max.y;
          textMesh.position.z = worldParent.z - Math.abs(centerX) / 2;
          textMesh.rotation.x = -(Math.PI / 2);
          textMesh.rotation.z = -(Math.PI / 4);
        }
      }

      // Internal user-defined type
      textMesh.userData = {
        type: 'label',
        name: parentMesh.userData.name,
        parentPos: worldParent
      };

      // Add labels
      this.get('labels').push(textMesh);
      parentObject.add(textMesh);
    }
  }

});
