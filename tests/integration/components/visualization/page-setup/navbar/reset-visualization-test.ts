import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | visualization/page-setup/navbar/reset-visualization', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Visualization::PageSetup::Navbar::ResetVisualization />`);

    let firstSVGElement = this.element.querySelector('svg');

    if(firstSVGElement === null) {
      assert.ok(null, 'no <svg> tag found');
    } else {
      assert.equal(firstSVGElement.getAttribute('class'), 'octicon align-middle');
    }

    let firstAElement = this.element.querySelector('div[title]');

    if(firstAElement === null) {
      assert.ok(null, 'no <div> tag found');
    } else {
      assert.equal(firstAElement.getAttribute('title'), 'Reset View');
    }
  });
});