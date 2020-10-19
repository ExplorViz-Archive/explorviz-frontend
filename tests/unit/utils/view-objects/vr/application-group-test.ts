import applicationGroup from 'explorviz-frontend/utils/view-objects/vr/application-group';
import { module, test } from 'qunit';

module('Unit | Utility | view-objects/vr/application-group', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = applicationGroup();
    assert.ok(result);
  });
});
