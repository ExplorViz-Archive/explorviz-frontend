import { stringShortener } from 'explorviz-frontend/helpers/string-shortener';
import { module, test } from 'qunit';

module('Unit | Helper | string shortener');

test('Shorten long word', function (assert) {
    let result = stringShortener(['veryLongWord', 5]);
    assert.equal(result, 'veryL...');
});

test('empty Word', function (assert) {
    let result = stringShortener(['', 7]);
    assert.equal(result, '');
});

test('word short enough', function (assert) {
    let result = stringShortener(['short', 5]);
    assert.equal(result, 'short');
});

test('Negative word length', function (assert) {
    let result = stringShortener(['word', -2]);
    assert.equal(result, '');
});

