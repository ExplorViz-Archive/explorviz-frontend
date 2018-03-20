import { moduleForModel, test } from 'ember-qunit';

moduleForModel('landscape', 'Unit | Model | landscape', {
  // Specify the other units that are required for this test.
   needs: ['model:system', 'model:applicationcommunication']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
