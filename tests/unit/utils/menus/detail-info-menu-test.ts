import DetailInfoMenu from 'explorviz-frontend/utils/menus/detail-info-menu';
import { module, test } from 'qunit';

module('Unit | Utility | detail info menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new DetailInfoMenu( () => {}, {title: 'test', entries: [] });
    assert.ok(result);
  });
});
