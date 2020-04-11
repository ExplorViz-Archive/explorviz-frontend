import applicationRenderingCenterAndZoomCalculator from 'explorviz-frontend/utils/application-rendering/center-and-zoom-calculator';
import { module, test } from 'qunit';

module('Unit | Utility | application rendering/center and zoom calculator');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = applicationRenderingCenterAndZoomCalculator({
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    width: 300,
    height: 100,
    depth: 200
  });
  //assert.ok(result);
  assert.equal(result.x, 150);
  assert.equal(result.y, 50);
  assert.equal(result.z, 100);
});
