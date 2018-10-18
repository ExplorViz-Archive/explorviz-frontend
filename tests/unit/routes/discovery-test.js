import { moduleFor, test } from 'ember-qunit';

moduleFor('route:discovery', 'Unit | Route | discovery', {
  // Specify the other units that are required for this test.
  needs: ['service:session', 'service:agents-listener']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
