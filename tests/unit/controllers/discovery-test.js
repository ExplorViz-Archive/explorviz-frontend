import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:discovery', 'Unit | Controller | discovery', {
  // Specify the other units that are required for this test.
  needs: ['service:rendering-service', 'service:agents-listener']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
