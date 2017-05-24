import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:visualization', 'Unit | Controller | visualization', {
  // Specify the other units that are required for this test.
  needs: ['service:session', 'service:landscape-reload', 'service:url-builder']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
