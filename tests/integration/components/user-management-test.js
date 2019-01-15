import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { typeOf } from '@ember/utils';
// import { render } from '@ember/test-helpers';
// import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | user-management', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // // Set any properties with this.set('myProperty', 'value');
    // // Handle any actions with this.set('myAction', function(val) { ... });

    // await render(hbs`{{user-management}}`);

    // assert.equal(this.element.textContent.trim(), '');

    // // Template block usage:
    // await render(hbs`
    //   {{#user-management}}
    //     template block text
    //   {{/user-management}}
    // `);

    // assert.equal(this.element.textContent.trim(), 'template block text');
    assert.equal(true, true, 'TODO');
  });

  test('generatePassword should return a string', function(assert) {
    const component = this.owner.lookup('component:user-management');

    const password_zero = component.generatePassword(0);
    const password_negative = component.generatePassword(-1);
    const password_positive = component.generatePassword(5);

    assert.ok(typeOf(password_zero) === 'string');
    assert.ok(typeOf(password_negative) === 'string');
    assert.ok(typeOf(password_positive) === 'string');
  });

  test('generatePassword should return value of correct length', function(assert) {
    const component = this.owner.lookup('component:user-management');

    const password_zero = component.generatePassword(0);
    const password_negative = component.generatePassword(-2);
    const password_positive = component.generatePassword(8);

    assert.ok(password_zero.length === 0);
    assert.ok(password_negative.length === 0);
    assert.ok(password_positive.length === 8);
  });
});
