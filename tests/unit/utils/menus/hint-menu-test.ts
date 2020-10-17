import HintMenu from 'explorviz-frontend/utils/menus/hint-menu';
import { module, test } from 'qunit';
import { Object3D } from 'three';

module('Unit | Utility | menus/hint-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new HintMenu(new Object3D(), 'test');
    assert.ok(result);
  });
});
