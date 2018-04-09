import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:replay', 'Unit | Controller | replay', {
  // Specify the other units that are required for this test.
  needs: ['service:session', 'service:rendering-service', 'service:url-builder', 'service:view-importer',
   'service:reload-handler', 'service:repos/landscape-repository']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
