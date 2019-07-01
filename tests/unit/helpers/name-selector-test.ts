
import { nameSelector } from 'explorviz-frontend/helpers/name-selector';
import { module, test } from 'qunit';

module('Unit | Helper | name selector');


test('name is present', function (assert) {
  let result = nameSelector([123456, "pName"]);
  assert.equal(result, "pName");
});
