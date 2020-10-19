import composeContent from 'explorviz-frontend/utils/vr-helper/detail-info-composer';
import { module, test } from 'qunit';
import THREE from 'three';

module('Unit | Utility | vr-helper/detail-info-composer', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = composeContent(new THREE.Object3D());
    assert.ok(result);
  });
});
