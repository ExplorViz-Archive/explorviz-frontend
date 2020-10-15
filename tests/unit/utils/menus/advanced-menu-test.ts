import AdvancedMenu from 'explorviz-frontend/utils/menus/advanced-menu';
import { module, test } from 'qunit';

module('Unit | Utility | menus/advanced-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new AdvancedMenu(() => {}, () => {return true;}, () => {});
    assert.ok(result);
  });
});
