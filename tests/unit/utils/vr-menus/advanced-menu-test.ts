import AdvancedMenu from 'explorviz-frontend/utils/vr-menus/advanced-menu';
import { module, test } from 'qunit';

module('Unit | Utility | vr-menus/advanced-menu', function (/* hooks */) {
  test('it exists', function (assert) {
    const result = new AdvancedMenu(() => {}, () => ({}), false, () => {});
    assert.ok(result);
  });
});
