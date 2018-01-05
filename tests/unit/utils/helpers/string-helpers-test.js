import { encodeStringForPopUp } from 'explorviz-frontend/utils/helpers/string-helpers';
import { module, test } from 'qunit';

module('Unit | Utility | helpers/string helpers');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = encodeStringForPopUp("<UNKNOWN-SYSTEM>");
  assert.equal(result, '&lt;UNKNOWN-SYSTEM&gt;');
});
