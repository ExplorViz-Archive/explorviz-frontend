import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | visualization/page-setup/timeline/plotly-timeline', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{visualization/page-setup/timeline/plotly-timeline}}`);

      const el:any = this.element;

      if(el) {
        assert.equal(el.textContent.trim(), 'No timestamps available.');
      } else {
        assert.notOk( "empty element", "There was no element to test." );
      }
  });
});
