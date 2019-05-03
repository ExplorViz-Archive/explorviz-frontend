import Object from '@ember/object';
import THREE from "three";
import { shortenString } from '../helpers/string-helpers';
import { inject as service } from "@ember/service";

export default Object.extend({

  labels: null,
  textMaterialFoundation: null,
  textMaterialComponent: null,
  textMaterialClazz: null,

  session: service(),
  configuration: service(),

  init() {
    this._super(...arguments);

    this.set('labels', []);
    this.set('textMaterialFoundation',
      new THREE.MeshBasicMaterial({
        color: this.get('configuration.applicationColors.textFoundation')
      })
    );

    this.set('textMaterialComponent',
      new THREE.MeshBasicMaterial({
        color: this.get('configuration.applicationColors.textComponent')
      })
    );

    this.set('textMaterialClazz',
    new THREE.MeshBasicMaterial({
      color: this.get('configuration.applicationColors.textClazz')
    })
  );

    this.set('currentUser', this.get('session.session.content.authenticated.user'));
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
        newMaterial.opacity = this.get('currentUser.settings.numericAttributes.appVizTransparencyIntensity');
        oldLabel[0].material = newMaterial;
      }
      else if (!transparent && oldLabel[0].material.transparent) {
        const newMaterial = oldLabel[0].material.clone();
        newMaterial.transparent = false;
        newMaterial.opacity = 1.0;
        oldLabel[0].material = newMaterial;
      }

      parentObject.add(oldLabel[0]);
    }
    // New TextGeometry necessary
    else {
      let { name: labelString, foundation, type, opened } = parentMesh.userData;

      // Text properties for TextGeometry
      const textSize = 2;
      const textHeight = 0.1;
      const curveSegments = 1;
      
      // Fixed text length for clazz labels
      if (type === 'clazz' && labelString.length > 10) {
        labelString = shortenString(labelString, 8);
      }

      let textGeometry = new THREE.TextGeometry(labelString, {
        font,
        size: textSize,
        height: textHeight,
        curveSegments
      });

      // Font color(material) depending on parent object
      let material;
      if (foundation) {
        material = this.get('textMaterialFoundation').clone();
      } else if (type === 'clazz') {
        material = this.get('textMaterialComponent').clone();
      } else {
        material = this.get('textMaterialClazz').clone();
      }

      // Apply transparency / opacity
      if (transparent) {
        material.transparent = true;
        material.opacity = this.get('currentUser.settings.numericAttributes.appVizTransparencyIntensity');
      }

      let textMesh = new THREE.Mesh(textGeometry, material);
      let textWidth = computeBoxSize(textGeometry).x;
      let parentBoxWidth = computeBoxSize(parentMesh.geometry).z;

      // Properties for label positioning, scaling and length
      const margin = 0.5;
      const staticScaleFactor = 0.3;
      const minTextHeight = 1;
      const minTextLength = 3;

      // Static size for clazz text
      if (type === 'clazz') {
        textGeometry.scale(staticScaleFactor, staticScaleFactor, staticScaleFactor);
      }
      // Handle label which is too big for parent component
      else if (textWidth > (parentBoxWidth - margin)) {
        // Compute factor to fit text to parent (including small margin)
        let scaleFactor = (parentBoxWidth - margin) / textWidth;
        textGeometry.scale(scaleFactor, scaleFactor, scaleFactor);

        // Update size data
        textWidth = computeBoxSize(textGeometry).x;
        let textHeight = computeBoxSize(textGeometry).y;

        // Handle label which is too small due to scaling
        if (textHeight < minTextHeight) {
          // Shorten label to reach minimal text height, 
          // Accounting for later added "..." to label by substracting '3'
          let labelLength = Math.max(Math.round(labelString.length * (textHeight / minTextHeight) - 3), minTextLength);
          labelString = shortenString(labelString, labelLength);

          // Update geometry and mesh based upon new label text
          textGeometry = new THREE.TextGeometry(labelString, {
            font,
            size: textSize,
            height: textHeight,
            curveSegments
          });
          textMesh.geometry = textGeometry;

          // Scale shortened label according to parent component size
          textWidth = computeBoxSize(textGeometry).x;
          scaleFactor = (parentBoxWidth - margin) / textWidth;
          textGeometry.scale(scaleFactor, scaleFactor, scaleFactor);
        }
      }

      // Compute center coordinates of parent box
      const centerParentBox = new THREE.Vector3();
      textGeometry.center();
      bBoxParent.getCenter(centerParentBox);

      // Set position and rotation
      if (opened) {
        textMesh.position.x = bBoxParent.min.x + 2;
        textMesh.position.y = bBoxParent.max.y;
        // Center mesh
        textMesh.position.z = centerParentBox.z;
        textMesh.rotation.x = -(Math.PI / 2);
        textMesh.rotation.z = -(Math.PI / 2);
      } else {
        textMesh.position.x = centerParentBox.x;
        textMesh.position.y = bBoxParent.max.y;
        textMesh.position.z = centerParentBox.z;
        textMesh.rotation.x = -(Math.PI / 2);

        if (type === 'clazz') {
          textMesh.rotation.z = -(Math.PI / 3);
        } else {
          textMesh.rotation.z = -(Math.PI / 4);
        }
      }

      // Internal user-defined type
      textMesh.userData = {
        type: 'label',
        name: labelString,
        parentPos: worldParent
      };

      // Add labels
      this.get('labels').push(textMesh);
      parentObject.add(textMesh);
    }

    /**
     * Updates bounding box of geometry and returns respective dimensions
     */
    function computeBoxSize(geometry) {
      geometry.computeBoundingBox();
      let boxDimensions = new THREE.Vector3();
      geometry.boundingBox.getSize(boxDimensions);
      return { x: boxDimensions.x, y: boxDimensions.y, z: boxDimensions.z };
    }
  }

});