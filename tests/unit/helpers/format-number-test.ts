
import { formatNumber } from 'explorviz-frontend/helpers/format-number';
import { module, test } from 'qunit';

module('Unit | Helper | name selector');

test('it works', function (assert) {
  let resultMs = formatNumber([2106245250.00, 'ms']);
  assert.equal(resultMs, '2106.2452');

  let resultS = formatNumber([2106245250.00, 's']);
  assert.equal(resultS, '2.1062');
});
