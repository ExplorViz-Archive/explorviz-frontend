import { moduleFor, test } from 'ember-qunit';

moduleFor('service:agent-reload', 'Unit | Service | agent reload', {
  // Specify the other units that are required for this test.
  needs: ['service:repos/agent-repository', 'service:session']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
