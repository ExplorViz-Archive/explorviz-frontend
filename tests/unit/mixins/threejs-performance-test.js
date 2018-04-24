import EmberObject from '@ember/object';
import ThreejsPerformanceMixin from 'explorviz-frontend/mixins/threejs-performance';
import { module, test } from 'qunit';

module('Unit | Mixin | threejs-performance', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let ThreejsPerformanceObject = EmberObject.extend(ThreejsPerformanceMixin);
    let subject = ThreejsPerformanceObject.create();
    assert.ok(subject);
  });
});
