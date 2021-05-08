import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | xr-collaboration-opener', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Visualization::PageSetup::Navbar::XrCollaborationOpener />`);

    const { textContent } = this.element;

    if (textContent === null) {
      assert.ok(null, 'no text content');
    } else {
      assert.equal(textContent.trim(), 'Collaboration');
    }
  });
});
