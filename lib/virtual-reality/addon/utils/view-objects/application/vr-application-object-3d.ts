import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import { GrabbableObject } from '../interfaces/grabbable-object';

/**
 * For the VR extension, we need a custom view object for applications to
 * implement the {@link GrabbableObject} interface. The interface marks an
 * application as grabbable by a controller and provides a method to get
 * the ID to send to the backend to identify the grabbed object.
 */
export default class VrApplicationObject3D extends ApplicationObject3D implements GrabbableObject {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canBeIntersected(_intersection: THREE.Intersection) {
    return true;
  }

  getGrabId(): string {
    return this.dataModel.instanceId;
  }
}
