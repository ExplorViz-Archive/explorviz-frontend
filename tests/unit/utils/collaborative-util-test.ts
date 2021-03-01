import { setupTest } from 'ember-qunit';
import collaborativeUtil from 'explorviz-frontend/utils/collaborative-util';
import { module, test } from 'qunit';
import THREE from 'three';

module('Unit | Utility | collaborative-util', function(hooks) {

  setupTest(hooks)

  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = collaborativeUtil([1,2,3], new THREE.Quaternion());
    assert.ok(result);
  });
});
