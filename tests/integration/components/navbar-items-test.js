//import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

//Stub service for navbar
// const navbarStub = Ember.Service.extend({
//   navbarLabels: ['Visualization', 'Tutorial']
// });

moduleForComponent('navbar-items', 'Integration | Component | navbar items', {
  integration: true,


 beforeEach: function(){
  needs: ['service:navbar']}
//  this.register('service:navbar', navbarStub);
//  this.inject('navbar', {as: 'navbarService'});
});

test('labels in navbar are rendered', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });



  this.render(hbs`{{navbar-items}}`);

  assert.equal(this.$().text().trim(), this.get('navbar').navbarLabels[0]);

  // // Template block usage:
  // this.render(hbs`
  //   {{#navbar-items}}
  //     template block text
  //   {{/navbar-items}}
  // `);

  // assert.equal(this.$().text().trim(), 'template block text');
   //assert.equal(true, true, 'TODO');
});
