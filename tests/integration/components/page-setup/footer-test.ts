import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | page-setup/footer', function(hooks) {
  setupRenderingTest(hooks);

  test('contains footer information', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{page-setup/footer}}`);

    let textContent = this.element.textContent;

    if(textContent === null) {
      assert.ok(null, 'textContent is null');
    } else {
      assert.ok(textContent.trim().includes('ExplorViz'));
    }
    
  });
});
