import { moduleForModel, test } from 'ember-qunit';

moduleForModel('procezz', 'Unit | Serializer | procezz', {
  // Specify the other units that are required for this test.
  needs: ['serializer:procezz', 'model:agent']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
