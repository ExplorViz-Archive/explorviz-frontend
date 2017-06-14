import Ember from 'ember';
import AlertifyHandlerMixin from 'explorviz-ui-frontend/mixins/alertify-handler';
import { module, test } from 'qunit';

module('Unit | Mixin | alertify handler');

// Replace this with your real tests.
test('it works', function(assert) {
  let AlertifyHandlerObject = Ember.Object.extend(AlertifyHandlerMixin);
  let subject = AlertifyHandlerObject.create();
  assert.ok(subject);
});
