import { moduleFor, test } from 'ember-qunit';

moduleFor('service:visualization/application/highlighter', 'Unit | Service | visualization/application/highlighter', {
  // Specify the other units that are required for this test.
  needs: ['service:repos/landscape-repository']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
