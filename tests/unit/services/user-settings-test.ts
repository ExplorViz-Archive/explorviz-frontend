import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | user-settings', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:user-settings');
    assert.ok(service);
  });
});

