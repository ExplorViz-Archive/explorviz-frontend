import LandscapeMenu from 'explorviz-frontend/utils/menus/landscape-menu';
import { module, test } from 'qunit';

module('Unit | Utility | menus/landscape-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new LandscapeMenu( () => {}, () => {}, () => {}, () => {});
    assert.ok(result);
  });
});
