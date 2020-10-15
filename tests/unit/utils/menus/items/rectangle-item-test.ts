import RectangleItem from 'explorviz-frontend/utils/menus/items/rectangle-item';
import { module, test } from 'qunit';

module('Unit | Utility | menus/items/rectangle-item', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new RectangleItem('id', {x: 0, y: 0}, 1, 1, '#ffffff');
    assert.ok(result);
  });
});
