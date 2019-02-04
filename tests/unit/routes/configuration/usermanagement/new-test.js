import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | configuration/usermanagement/new', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:configuration/usermanagement/new');
    assert.ok(route);
  });
});
