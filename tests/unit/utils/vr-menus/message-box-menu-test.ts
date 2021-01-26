import MessageBoxMenu from 'explorviz-frontend/utils/vr-menus/message-box-menu';
import { module, test } from 'qunit';

module('Unit | Utility | message-box-menu', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new MessageBoxMenu({
      title: 'Test', 
      text: 'Hello, world!',
      color: 'blue',
      time: 1.0
    });
    assert.ok(result);
  });
});
