import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | collaborative-settings-service', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:collaborative-settings-service');
    assert.ok(service);
  });
});

