import { moduleForModel, test } from 'ember-qunit';

moduleForModel('procezz', 'Unit | Model | procezz', {
  // Specify the other units that are required for this test.
  needs: ['model:agent']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
