//import { module, test } from 'qunit';
import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
//import { render } from '@ember/test-helpers';
//import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';

/* eslint-disable */
const sessionStub = Service.extend({
  session: {
    content: {
      authenticated: {
        username: 'testUsernameExplorViz'
      }
    }
  }
});
/* eslint-enable */

module('Integration | Component | page-setup/navbar', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:session', sessionStub);
  });

  // TODO Seems to fail due to route-action-helper
  // https://github.com/DockYard/ember-route-action-helper/issues/42

 /*test('visualization template contains main routes', async function(assert) {
    await render(hbs`{{page-setup/navbar}}`);

    assert.ok(this.element.textContent.trim().includes('Visualization'));
    assert.ok(this.element.textContent.trim().includes('Replay'));
    assert.ok(this.element.textContent.trim().includes('Discovery'));
  });

  test('username is rendered', async function(assert) {
    await render(hbs`{{page-setup/navbar}}`);

    assert.equal(this.element.textContent.trim(), "test");
  });*/
});
