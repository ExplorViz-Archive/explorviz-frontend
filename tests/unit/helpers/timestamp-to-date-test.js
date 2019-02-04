
import { timestampToDate } from 'explorviz-frontend/helpers/timestamp-to-date';
import { module, test } from 'qunit';

module('Unit | Helper | timestamp to date');

test('timestamp to time', function (assert) {
  let assertedResult = "15:32:18";
  let result = timestampToDate([1549204338000, "time"]);

  assert.equal(result, assertedResult);
});

test('timestamp to toLocalString', function (assert) {
  let assertedResult= "2/3/2019, 3:32:18 PM";
  let result = timestampToDate([1549204338000, "localString"]);
  
  assert.equal(result, assertedResult);
});

test('timestamp to String', function (assert) {
  let assertedResult= "Sun Feb 03 2019 15:32:18 GMT+0100 (Central European Standard Time)";
  let result = timestampToDate([1549204338000, ""]);
  
  assert.equal(result, assertedResult);
});
