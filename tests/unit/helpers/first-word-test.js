
import { firstWord } from 'explorviz-frontend/helpers/first-word';
import { module, test } from 'qunit';

module('Unit | Helper | first word');

test('first word of multiple words', function (assert) {
  let result = firstWord(['First second']);
  assert.equal(result, 'First');
});

test('first word of single word', function (assert) {
  let result = firstWord(['word']);
  assert.equal(result, 'word');
});

test('first word of empty string', function (assert) {
  let result = firstWord([""]);
  assert.equal(result, "");
});

