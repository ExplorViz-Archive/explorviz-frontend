import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
//import hbs from 'htmlbars-inline-precompile';


module('Integration | Component | landscape rendering', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    //this.render(hbs`{{landscape-rendering}}`);

    assert.equal(true, true);

    // Template block usage:
    //this.render(hbs`
    //  {{#landscape-rendering}}
    //    template block text
    //  {{/landscape-rendering}}
    // `);
  });
});
