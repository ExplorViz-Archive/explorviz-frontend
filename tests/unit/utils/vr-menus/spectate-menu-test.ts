import { module, test } from 'qunit';
import SpectateMenu from 'virtual-reality/utils/vr-menus/spectate-menu';

module('Unit | Utility | vr-menus/spectate-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new SpectateMenu( () => {});
    assert.ok(result);
  });
});
