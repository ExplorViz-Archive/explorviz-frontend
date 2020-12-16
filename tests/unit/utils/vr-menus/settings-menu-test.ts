import { module, test } from 'qunit';
import SettingsMenu from 'virtual-reality/utils/vr-menus/settings-menu';

module('Unit | Utility | vr-menus/settings-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new SettingsMenu(() => {}, () => {} , false );
    assert.ok(result);
  });
});
