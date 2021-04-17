import InteractiveItem from 'explorviz-frontend/utils/vr-menus/items/interactive-item';
import { module, test } from 'qunit';

module('Unit | Utility | vr-menus/items/interactive-item', function (/* hooks */) {
  class TestItem extends InteractiveItem {
    drawToCanvas() {
    }

    getBoundingBox() {
      return {
        minX: 0, maxX: 1, minY: 0, maxY: 0,
      };
    }
  }

  test('it exists', function (assert) {
    const result = new TestItem('id', { x: 0, y: 0 });
    assert.ok(result);
  });
});
