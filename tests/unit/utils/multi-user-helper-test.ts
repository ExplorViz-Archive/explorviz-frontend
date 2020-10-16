import getControllerPose from 'explorviz-frontend/utils/multi-user-helper';
import { module, test } from 'qunit';
import {Object3D} from 'three';

module('Unit | Utility | multi-user-helper', function( /* hooks */) {

  test('it exists', function(assert) {
    let result = getControllerPose(new Object3D());
    assert.ok(result);
  });
});
