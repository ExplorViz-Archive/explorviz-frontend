import { test } from 'qunit';
import moduleForAcceptance from 'explorviz-frontend/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | index');

test('visiting /index', function(assert) {
  visit('/index');

  andThen(function() {
    assert.equal(currentURL(), '/login', "Index route replaces current URL " + 
      "with login route.");
  });
});
