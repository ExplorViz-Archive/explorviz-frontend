import { moduleForModel, test } from 'ember-qunit';

moduleForModel('nodegroup', 'Unit | Model | nodegroup', {
  // Specify the other units that are required for this test.
  needs: ['model:system']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
