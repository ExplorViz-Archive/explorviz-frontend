import { module, test } from 'qunit';
import THREE from 'three';
import VRControllerBindingsList from 'virtual-reality/utils/vr-controller/vr-controller-bindings-list';
import VRControllerBindings from 'virtual-reality/utils/vr-controller/vr-controller-bindings';
import MenuGroup from 'virtual-reality/utils/vr-menus/menu-group';
import VRController from 'virtual-reality/utils/vr-rendering/VRController';

module('Unit | Utility | vr-rendering/VRController', function() {

  test('it exists', function( assert ) {
    let result = new VRController({
      gamepadIndex: 0, 
      color: new THREE.Color,
      raySpace: new THREE.Group(), 
      gripSpace: new THREE.Group(),
      menuGroup: new MenuGroup(),
      bindings: new VRControllerBindingsList(new VRControllerBindings({}), []),
      scene: new THREE.Scene(),
      intersectableObjects: []
    });
    assert.ok(result);
  });
});
