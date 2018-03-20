import { moduleForModel, test } from 'ember-qunit';

moduleForModel('cumulatedclazzcommunication', 'Unit | Model | cumulatedclazzcommunication', {
  // Specify the other units that are required for this test.
  needs: ['model:aggregatedclazzcommunication', 'model:clazzcommunication',]
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
