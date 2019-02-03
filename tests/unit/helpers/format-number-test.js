
import { formatNumber } from 'explorviz-frontend/helpers/format-number';
import { module, test } from 'qunit';

module('Unit | Helper | name selector');

test('it works', function (assert) {
  let result = formatNumber([123456]);
  assert.ok(result);
});
