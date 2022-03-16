import Service, { inject as service } from '@ember/service';
import LandscapeObject3D from 'explorviz-frontend/view-objects/3d/landscape/landscape-object-3d';
import THREE from 'three';
import RemoteVrUserService from 'virtual-reality/services/remote-vr-users';

type MousePing = {
  obj: THREE.Object3D,
  time: number
};

export default class PingService extends Service.extend({
  // anything which *must* be merged to prototype here
}) {

  @service('remote-vr-users')
  private remoteUsers!: RemoteVrUserService;

  localPing: MousePing | undefined | null;

  addPing(parentObj: THREE.Object3D, position: THREE.Vector3, color: THREE.Color) {
    if (this.localPing) {
      this.removeLocalPing();
    }

    let size = 2;

    if (parentObj instanceof LandscapeObject3D) {
      size = 0.2;
    }

    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color });
    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.copy(position);

    parentObj.add(sphere);

    this.localPing = { obj: sphere, time: Date.now() };
  }

  removeLocalPing() {
    if (this.localPing) {
      this.localPing.obj.parent?.remove(this.localPing.obj);
      this.localPing = null;
    }
  }

  updatePings() {
    const now = Date.now();
    if (this.localPing && now - this.localPing.time > 2000) {
      this.removeLocalPing();
    }

    Array.from(this.remoteUsers.getAllRemoteUsers()).forEach((user) => {
      user.updateMousePing();
    });
  }

  // normal class body definition here
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'ping-service': PingService;
  }
}
