import { moduleForModel, test } from 'ember-qunit';

moduleForModel('clazzcommunication', 'Unit | Model | clazzcommunication', {
  // Specify the other units that are required for this test.
  needs: ['model:clazz']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
