import { moduleFor, test } from 'ember-qunit';

moduleFor('service:timeshift-reload', 'Unit | Service | timeshift reload', {
  // Specify the other units that are required for this test.
  needs: ['service:session']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
