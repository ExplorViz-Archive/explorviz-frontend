import { test } from 'qunit';
import moduleForAcceptance from 'explorviz-ui-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | badroute');

test('visiting /badroute', function(assert) {
  visit('/badroute');

  andThen(function() {
    assert.equal(currentURL(), '/login', "Every non valid route is redirected" +
      " to login.");
  });
});
