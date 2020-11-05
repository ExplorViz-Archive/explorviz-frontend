import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | visualization/page-setup/navbar/pause-reload', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('toggleVisualizationUpdating', () => {});

    await render(hbs`<Visualization::PageSetup::Navbar::PauseReload
                       @toggleVisualizationUpdating={{this.toggleVisualizationUpdating}}
                     />`);

    let textContent = this.element.textContent;

    assert.ok(textContent !== null && textContent.trim() === '');
  });
});