import RemoteVrUser from 'explorviz-frontend/utils/vr-multi-user/remote-vr-user';
import { module, test } from 'qunit';
import THREE from 'three';
import LocalVrUser from 'virtual-reality/services/local-vr-user';

module('Unit | Utility | remote-vr-user', function(/* hooks */) {

  test('it exists', function(assert) {
    let result = new RemoteVrUser({
      userName: 'Test', userId: '123', color: new THREE.Color('red'), 
      state: 'online', localUser: new LocalVrUser()
    });
    assert.ok(result);
  });
});
