
import { timestampToDate } from 'explorviz-frontend/helpers/timestamp-to-date';
import { module, test } from 'qunit';

module('Unit | Helper | timestampt to date');

test('timestamp to time', function (assert) {
  let result = timestampToDate([1549204338000, "time"]);
  assert.ok(result);
});