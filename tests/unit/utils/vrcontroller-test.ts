// import VRController from 'explorviz-frontend/utils/vrcontroller';
import { module, test } from 'qunit';
import VRController from 'virtual-reality/utils/VRController';
import THREE from 'three';

module('Unit | Utility | VRController', function() {

  // Replace this with your real tests.
  test('it works', function( assert ) {
    let result = new VRController(0, new THREE.Group(), new THREE.Group(), {}, new THREE.Scene());
    assert.ok(result);
  });
});
