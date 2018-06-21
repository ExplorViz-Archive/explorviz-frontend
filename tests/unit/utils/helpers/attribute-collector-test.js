import helpersAttributeValueCollector from 'explorviz-frontend/utils/helpers/attribute-collector';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Utility | helpers/attribute-collector', function(hooks) {
  setupTest(hooks);

  let testObject;

  hooks.before(function() {

    const nestedClazz3 = {data: "test", name: "6", proc: "Asd"}
    const nestedClazz2 = {data: "test", name: "5", proc: "Asd"}
    const nestedClazz = {data: "test", name: "4", proc: "Asd"}

    const childComponent2 = {data: null, name: "3", dir: "C:/Documents/2", children: [], clazzes: [nestedClazz2, nestedClazz3]}
    const childComponent = {data: null, name: "2", dir: "C:/Documents/1", children: [childComponent2], clazzes: [nestedClazz]}

    const parentObject = {data: null, name: "1", dir: "C:/Documents", children: [childComponent], clazzes: []}

    testObject = parentObject;
  });

  test('no arguments should throw Error', function(assert) {
    assert.throws(() => {helpersAttributeValueCollector()}, new Error("no arguments"));
  });

  test('at least one argument is undefined should throw Error', function(assert) {
    assert.throws(() => {helpersAttributeValueCollector(testObject, "name")}, new Error("no arguments"));
  });

  test('nestedSearchObjectNames array is null should not fail test', function(assert) {
    assert.ok(executeTestScenario(["1"], null));
  });

  test('nestedSearchObjectNames array is empty array should not fail test', function(assert) {
    assert.ok(executeTestScenario(["1"], []));
  });

  test('nested JS objects with string values', function(assert) {
    const expected = ["1", "2", "3", "4", "5", "6"];
    assert.ok(executeTestScenario(expected, ["children", "clazzes"]));
  });

  function executeTestScenario(expectedValue, nestedSearchObjectNames) {
    let result = helpersAttributeValueCollector(testObject, "name", false, nestedSearchObjectNames);    

    const containsAll = (arr1, arr2) => 
      arr2.every(arr2Item => arr1.includes(arr2Item))

    const sameMembers = (arr1, arr2) => 
      containsAll(arr1, arr2) && containsAll(arr2, arr1);

    return sameMembers(expectedValue, result);
  }

});
