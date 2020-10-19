import getControllerPose from 'explorviz-frontend/utils/vr-helper/multi-user-helper';
import { module, test } from 'qunit';
import {Object3D} from 'three';

module('Unit | Utility | vr-helper/multi-user-helper', function( /* hooks */) {

  test('it exists', function(assert) {
    let result = getControllerPose(new Object3D());
    assert.ok(result);
  });
});
