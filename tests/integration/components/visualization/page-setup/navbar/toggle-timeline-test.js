import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | visualization/page-setup/navbar/toggle-timeline', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{visualization/page-setup/navbar/toggle-timeline}}`);

    assert.equal(this.element.querySelector('span').getAttribute('class'), 
      'glyphicon glyphicon-resize-vertical');

    assert.equal(this.element.querySelector('a').getAttribute('title'), 
      'Toggle timeline');
  });
  
});
