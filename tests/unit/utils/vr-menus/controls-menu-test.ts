import ControlsMenu from 'explorviz-frontend/utils/vr-menus/controls-menu';
import { module, test } from 'qunit';

module('Unit | Utility | vr-menus/controls-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new ControlsMenu(() => {}, 'test', true);
    assert.ok(result);
  });
});
