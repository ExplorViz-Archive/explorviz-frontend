import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | visualization/page-setup/navbar/sql-opener', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Visualization::PageSetup::Navbar::SqlOpener />`);

    let textContent = this.element.textContent;

    if(textContent === null) {
      assert.ok(null, 'no text content');
    } else {
      assert.equal(textContent.trim(), '');
    }

    // Template block usage:
    await render(hbs`
      <Visualization::PageSetup::Navbar::SqlOpener>
      </Visualization::PageSetup::Navbar::SqlOpener>
    `);

    textContent = this.element.textContent;

    if(textContent === null) {
      assert.ok(null, 'no text content');
    } else {
      assert.equal(textContent.trim(), '');
    }
  });
});