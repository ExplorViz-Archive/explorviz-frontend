import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | configuration/heatmapsettings', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:configuration/heatmapsettings');
    assert.ok(route);
  });
});
