import SpectateMenu from 'explorviz-frontend/utils/menus/spectate-menu';
import { module, test } from 'qunit';

module('Unit | Utility | menus/spectate-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new SpectateMenu( () => {});
    assert.ok(result);
  });
});
