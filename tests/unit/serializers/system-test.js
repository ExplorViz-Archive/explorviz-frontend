import { moduleForModel, test } from 'ember-qunit';

moduleForModel('system', 'Unit | Serializer | system', {
  // Specify the other units that are required for this test.
  needs: ['serializer:system', 'model:landscape', 'model:nodegroup']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
