import ControlsMenu from 'explorviz-frontend/utils/menus/controls-menu';
import { module, test } from 'qunit';

module('Unit | Utility | controls-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new ControlsMenu(() => {}, 'test', () => {return true ;});
    assert.ok(result);
  });
});
