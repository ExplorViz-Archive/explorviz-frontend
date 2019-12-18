import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | visualization/page-setup/navbar/landscape-downloader', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{visualization/page-setup/navbar/landscape-downloader}}`);

    let textContent = this.element.textContent;

    if(textContent === null) {
      assert.ok(null, 'no text content');
    } else {
      assert.equal(textContent.trim(), '');
    }

    // Template block usage:
    await render(hbs`
      {{#visualization/page-setup/navbar/landscape-downloader}}
        template block text
      {{/visualization/page-setup/navbar/landscape-downloader}}
    `);

    textContent = this.element.textContent;

    if(textContent === null) {
      assert.ok(null, 'no text content');
    } else {
      assert.equal(textContent.trim(), '');
    }
  });
});