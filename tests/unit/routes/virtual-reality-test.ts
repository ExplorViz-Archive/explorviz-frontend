import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | virtual-reality', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:virtual-reality');
    assert.ok(route);
  });
});
