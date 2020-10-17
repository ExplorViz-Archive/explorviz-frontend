import composeContent from 'explorviz-frontend/utils/detail-info-composer';
import { module, test } from 'qunit';
import THREE from 'three';

module('Unit | Utility | detail-info-composer', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = composeContent(new THREE.Object3D());
    assert.ok(result);
  });
});
