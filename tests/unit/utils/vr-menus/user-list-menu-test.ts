import { module, test } from 'qunit';
import UserListMenu from 'virtual-reality/utils/vr-menus/user-list-menu';

module('Unit | Utility | vr-menus/user-list-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let localUserService = this.owner.lookup('service:local-user');
    let result = new UserListMenu(localUserService, []);
    assert.ok(result);
  });
});
