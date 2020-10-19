import MessageBoxMenu from 'explorviz-frontend/utils/message-box-menu';
import { module, test } from 'qunit';
import { Object3D } from 'three';

module('Unit | Utility | message-box-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new MessageBoxMenu(new Object3D());
    assert.ok(result);
  });
});
