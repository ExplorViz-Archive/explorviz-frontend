import HardwareModels from 'explorviz-frontend/utils/hardware-models';
import { module, test } from 'qunit';

module('Unit | Utility | hardware-models', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new HardwareModels();
    assert.ok(result);
  });
});
