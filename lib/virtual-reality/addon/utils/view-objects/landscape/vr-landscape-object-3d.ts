import { StructureLandscapeData } from "explorviz-frontend/utils/landscape-schemes/structure-data";
import LandscapeObject3D from "explorviz-frontend/view-objects/3d/landscape/landscape-object-3d";
import { GrabbableObject } from "../../vr-menus/pseudo-menu/grab-menu";

/**
 * For the VR extension, we need a custom view object for landscapes to
 * implement the {@link GrabbableObject} interface. The interface marks the
 * landscape as grabbable by a controller and provides a method to get
 * the ID to send to the backend to identify the grabbed object.
 */
export default class VrLandscapeObject3D extends LandscapeObject3D implements GrabbableObject {
    constructor(landscape: StructureLandscapeData) {
        super(landscape);
    }

    getGrabId(): string {
        return this.dataModel.landscapeToken;
    }
}