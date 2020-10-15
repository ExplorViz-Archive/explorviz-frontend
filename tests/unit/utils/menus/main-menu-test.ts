import MainMenu from 'explorviz-frontend/utils/menus/main-menu';
import { module, test } from 'qunit';

module('Unit | Utility | menus/main-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new MainMenu( () => {}, () => {}, () => {}, () => {}, () => {}, () => {});
    assert.ok(result);
  });
});
