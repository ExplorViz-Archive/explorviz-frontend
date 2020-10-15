import ConnectionMenu from 'explorviz-frontend/utils/menus/connection-menu';
import { module, test } from 'qunit';

module('Unit | Utility | menus/connection-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new ConnectionMenu( () => {});
    assert.ok(result);
  });
});
