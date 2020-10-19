import ConnectionMenu from 'explorviz-frontend/utils/vr-menus/connection-menu';
import { module, test } from 'qunit';

module('Unit | Utility | vr-menus/connection-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new ConnectionMenu( () => {}, 'offline', () => {});
    assert.ok(result);
  });
});
