
import { firstWord } from 'explorviz-frontend/helpers/first-word';
import { module, test } from 'qunit';

module('Unit | Helper | timestampt to date');

test('timestamp to time', function (assert) {
  let result = firstWord(["First second"]);
  assert.equal(result, "First");
});

