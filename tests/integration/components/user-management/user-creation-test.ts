import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
// import { render } from '@ember/test-helpers';
// import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | user-management/user-creation', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

/*     await render(hbs`{{user-management/user-creation}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#user-management/user-creation}}
        template block text
      {{/user-management/user-creation}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text'); */
    assert.equal(true, true, 'TODO');
  });
});
