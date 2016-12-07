import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('time-shift', 'Integration | Component | time shift', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{time-shift}}`);

  // Template block usage:
  this.render(hbs`
    {{#time-shift}}
      template block text
    {{/time-shift}}
  `);

  assert.equal(true, true, 'TODO');
});
