import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('hammer-interaction', 'Integration | Component | hammer interaction', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{hammer-interaction}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#hammer-interaction}}
      template block text
    {{/hammer-interaction}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
