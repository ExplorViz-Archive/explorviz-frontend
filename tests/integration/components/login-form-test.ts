import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';


module('Integration | Component | login form', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await this.render(hbs`{{login-form}}`);

    assert.equal($('#loginModal').text().trim(), 'Sign In');

    // Template block usage:
    await this.render(hbs`
      {{#login-form}}
        template block text
      {{/login-form}}
    `);

    assert.equal($('#loginModal').text().trim(), 'Sign In');
  });
});
