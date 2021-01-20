import { module, test } from 'qunit';
import SpectateMenu from 'virtual-reality/utils/vr-menus/spectate-menu';

module('Unit | Utility | vr-menus/spectate-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let spectateUserService = this.owner.lookup('service:spectate-user');
    let result = new SpectateMenu( () => {}, spectateUserService, new Map());
    assert.ok(result);
  });
});
