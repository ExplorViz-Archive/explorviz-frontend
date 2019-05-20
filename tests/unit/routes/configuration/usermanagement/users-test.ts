import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | configuration/usermanagement/users', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:configuration/usermanagement/users');
    assert.ok(route);
  });
});
