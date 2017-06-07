import Ember from 'ember';
import THREEPerformanceMixin from 'explorviz-ui-frontend/mixins/threeperformance';
import { module, test } from 'qunit';

module('Unit | Mixin | threeperformance');

// Replace this with your real tests.
test('it works', function(assert) {
  let THREEPerformanceObject = Ember.Object.extend(THREEPerformanceMixin);
  let subject = THREEPerformanceObject.create();
  assert.ok(subject);
});
