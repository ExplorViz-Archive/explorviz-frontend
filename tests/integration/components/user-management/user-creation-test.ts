import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
// import { render } from '@ember/test-helpers';
import { typeOf } from '@ember/utils';
// import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | user-management/user-creation', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

/*     await render(hbs`{{user-management/user-creation}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#user-management/user-creation}}
        template block text
      {{/user-management/user-creation}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text'); */
    assert.equal(true, true, 'TODO');
  });

  test('generatePassword should return a string', function(assert) {
    const component = this.owner.lookup('component:user-management/user-creation');

    const password_zero = component.generatePassword(0);
    const password_negative = component.generatePassword(-1);
    const password_positive = component.generatePassword(5);

    assert.ok(typeOf(password_zero) === 'string');
    assert.ok(typeOf(password_negative) === 'string');
    assert.ok(typeOf(password_positive) === 'string');
  });

  test('generatePassword should return value of correct length', function(assert) {
    const component = this.owner.lookup('component:user-management/user-creation');

    const password_zero = component.generatePassword(0);
    const password_negative = component.generatePassword(-2);
    const password_positive = component.generatePassword(8);

    assert.ok(password_zero.length === 0);
    assert.ok(password_negative.length === 0);
    assert.ok(password_positive.length === 8);
  });
});
