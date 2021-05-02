import { Perspective } from 'collaborative-mode/utils/collaborative-data';
import { module, test } from 'qunit';

module('Unit | Utility | collaborative-data', function (/* hooks */) {
  // Replace this with your real tests.
  test('it works', function (assert) {
    const result: Perspective = {
      position: [1, 2, 3],
      rotation: [1, 3, 2],
      requested: true,
    };
    assert.ok(result);
  });
});
