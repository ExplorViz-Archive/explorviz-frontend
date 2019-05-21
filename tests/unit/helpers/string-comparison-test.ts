
import { stringComparison } from 'explorviz-frontend/helpers/string-comparison';
import { module, test } from 'qunit';

module('Unit | Helper | string comparison');

test('compare test String', function (assert) {
  let result = stringComparison(["testString", "testString"]);
  assert.ok(result);
});

