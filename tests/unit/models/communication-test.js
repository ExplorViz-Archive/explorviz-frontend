import { moduleForModel, test } from 'ember-qunit';

moduleForModel('communication', 'Unit | Model | communication', {
  // Specify the other units that are required for this test.
  needs: ['model:landscape']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
