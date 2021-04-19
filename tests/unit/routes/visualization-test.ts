import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | visualization', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:visualization');
    assert.ok(route);
  });
});
