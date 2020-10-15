import CloseIcon from 'explorviz-frontend/utils/close-icon';
import { module, test } from 'qunit';
import { Texture } from 'three';

module('Unit | Utility | close-icon', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new CloseIcon(new Texture());
    assert.ok(result);
  });
});
