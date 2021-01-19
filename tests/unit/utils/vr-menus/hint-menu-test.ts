import HintMenu from 'explorviz-frontend/utils/vr-menus/hint-menu';
import { module, test } from 'qunit';

module('Unit | Utility | vr-menus/hint-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new HintMenu('test');
    assert.ok(result);
  });
});
