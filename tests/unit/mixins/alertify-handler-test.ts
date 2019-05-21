import EmberObject from '@ember/object';
import AlertifyHandlerMixin from 'explorviz-frontend/mixins/alertify-handler';
import { module, test } from 'qunit';

module('Unit | Mixin | alertify-handler', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let AlertifyHandlerObject = EmberObject.extend(AlertifyHandlerMixin);
    let subject = AlertifyHandlerObject.create();
    assert.ok(subject);
  });
});
