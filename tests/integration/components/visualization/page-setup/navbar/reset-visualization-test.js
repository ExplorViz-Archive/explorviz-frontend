import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | visualization/page-setup/navbar/reset-visualization', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{visualization/page-setup/navbar/reset-visualization}}`);

    assert.equal(this.element.querySelector('svg').getAttribute('class'),
      'octicon align-middle');

    assert.equal(this.element.querySelector('a').getAttribute('title'),
      'Reset View');
  });
});