import ImageItem from 'explorviz-frontend/utils/menus/items/image-item';
import { module, test } from 'qunit';

module('Unit | Utility | image-item', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new ImageItem();
    assert.ok(result);
  });
});
