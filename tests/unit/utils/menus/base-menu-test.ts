import BaseMenu from 'explorviz-frontend/utils/menus/base-menu';
import { module, test } from 'qunit';

module('Unit | Utility | menus/base-menu', function(/* hooks */) {

  class TestMenu extends BaseMenu {}

  test('it exists', function(assert) {
    let result = new TestMenu();
    assert.ok(result);
  });
});
