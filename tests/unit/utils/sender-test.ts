import { module, test } from 'qunit';
import Sender from 'virtual-reality/utils/sender';

module('Unit | Utility | sender', function(/* hooks */) {

  test('it exists', function(assert) {
    let service = this.owner.lookup('service:web-socket')
    let sender = new Sender(service);
    assert.ok(sender);
  });
});
