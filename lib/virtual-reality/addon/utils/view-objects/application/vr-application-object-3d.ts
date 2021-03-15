import { Trace } from "explorviz-frontend/utils/landscape-schemes/dynamic-data";
import { Application } from "explorviz-frontend/utils/landscape-schemes/structure-data";
import ApplicationObject3D from "explorviz-frontend/view-objects/3d/application/application-object-3d";
import BoxLayout from "explorviz-frontend/view-objects/layout-models/box-layout";
import { GrabbableObject } from "../../vr-menus/ui-less-menu/grab-menu";

/**
 * For the VR extension, we need a custom view object for applications to
 * implement the {@link GrabbableObject} interface. The interface marks an
 * application as grabbable by a controller and provides a method to get
 * the ID to send to the backend to identify the grabbed object.
 */
export default class VrApplicationObject3D extends ApplicationObject3D implements GrabbableObject {
    constructor(application: Application, boxLayoutMap: Map<string, BoxLayout>, traces: Trace[]) {
        super(application, boxLayoutMap, traces);
    }

    getGrabId(): string {
        return this.dataModel.pid;
    }
}