import { Perspective } from 'collaborative-mode/utils/collaborative-data';
import { module, test } from 'qunit';

module('Unit | Utility | collaborative-data', function(_hooks) {

  // Replace this with your real tests.
  test('it works', function(assert) {
    let result: Perspective = {
      position: {x:1, y:1, z:2 },
      rotation: {x:1, y:1, z:2 },
      requested: true
    }
    assert.ok(result);
  });
});
