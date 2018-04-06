import processNameSelector from 'explorviz-frontend/utils/helpers/name-selector';
import { module, test } from 'qunit';

module('Unit | Utility | helpers/name selector');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = processNameSelector("1234", null);
  assert.equal(result, "1234");
});
