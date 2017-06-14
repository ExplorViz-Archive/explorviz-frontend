import Ember from 'ember';
import ThreejsPerformanceMixin from 'explorviz-ui-frontend/mixins/threejs-performance';
import { module, test } from 'qunit';

module('Unit | Mixin | threejs performance');

// Replace this with your real tests.
test('it works', function(assert) {
  let ThreejsPerformanceObject = Ember.Object.extend(ThreejsPerformanceMixin);
  let subject = ThreejsPerformanceObject.create();
  assert.ok(subject);
});
