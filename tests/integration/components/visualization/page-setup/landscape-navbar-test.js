import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | visualization/page-setup/landscape-navbar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    
    await render(hbs`{{visualization/page-setup/landscape-navbar 
      content=(array 
        "visualization/page-setup/navbar/reset-visualization" 
        "visualization/page-setup/navbar/toggle-timeline" 
        "visualization/page-setup/navbar/export-landscape"
      )
    }}`);

    assert.equal(this.element.querySelector('ul').getAttribute('class'), 
      'nav navbar-nav navbar-left');

    const listOfAElements = this.element.querySelectorAll('a');

    const aTitleList = ["Toggle timeline", "Export landscape", "Reset view"];

    listOfAElements.forEach((el) => {

      const title = el.getAttribute('title');

      if(aTitleList.includes(title)) {
        assert.ok(true, 'Title rendered: ' + title);

        const index = aTitleList.findIndex((aTitle) => {
          return aTitle === title;
        });

        // remove from array
        aTitleList.splice(index, 1);
      } 
      else {
        assert.notOk(true, 'Title rendered, but not considered in test: ' + title);
      }
      
    });

    // if something is still remaining, fail test
    aTitleList.forEach((remainingTitle) => {
      assert.notOk(true, 'Title NOT rendered: ' + remainingTitle + 
        '. Maybe it is gone and the test needs to be updated.');      
    });


  });


});
