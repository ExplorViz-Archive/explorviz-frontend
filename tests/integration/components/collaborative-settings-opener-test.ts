import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | collaborative-settings-opener', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`{{collaborative-settings-opener addComponent=externalAction}}`);

    assert.equal(this.element.querySelector('li')?.className, 'nav-item');

    let buttonText = this.element?.querySelector('.nav-link-with-cursor');

    assert.equal(buttonText?.textContent, 'Collaborative Mode');

  });

  test('the button works', async function (assert) {
    await render(hbs`{{collaborative-settings-opener addComponent=externalAction}}`);
    this.set('externalAction', function (args: string) {
      assert.equal(args, 'collaborative-settings');
    })

    await click('.nav-link-with-cursor');
  });
});
