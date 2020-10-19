import ImageItem from 'explorviz-frontend/utils/vr-menus/items/image-item';
import { module, test } from 'qunit';

module('Unit | Utility | vr-menus/image-item', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new ImageItem('test', new HTMLImageElement(), {x: 0, y: 0}, 20 ,20);
    assert.ok(result);
  });
});
