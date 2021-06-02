import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import applyCommunicationLayout from 'explorviz-frontend/utils/application-rendering/communication-layouter';
import Configuration from 'explorviz-frontend/services/configuration';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import CommunicationLayout from 'explorviz-frontend/view-objects/layout-models/communication-layout';
import { Vector3 } from 'three';
import { DrawableClassCommunication } from '../landscape-rendering/class-communication-computer';

export default class CommunicationRendering {
  // Service to access color preferences
  configuration: Configuration;

  constructor(configuration: Configuration) {
    this.configuration = configuration;
  }

  private computeCurveHeight(commLayout: CommunicationLayout) {
    let baseCurveHeight = 20;

    if (this.configuration.commCurveHeightDependsOnDistance) {
      const classDistance = Math.hypot(
        commLayout.endX - commLayout.startX, commLayout.endZ - commLayout.startZ,
      );
      baseCurveHeight = classDistance * 0.5;
    }

    return baseCurveHeight * this.configuration.commCurveHeightMultiplier;
  }

  // Add arrow indicators for drawable class communication
  private addArrows(pipe: ClazzCommunicationMesh, curveHeight: number, viewCenterPoint: Vector3) {
    const arrowOffset = 0.8;
    const arrowHeight = curveHeight / 2 + arrowOffset;
    const arrowThickness = this.configuration.commArrowThickness;
    const arrowColorHex = this.configuration.applicationColors.communicationArrow.getHex();

    if (typeof arrowThickness === 'number' && arrowThickness > 0.0) {
      pipe.addArrows(viewCenterPoint, arrowThickness, arrowHeight, arrowColorHex);
    }
  }

  /**
   * Computes communication and communication arrows and adds them to the
   * applicationObject3D
   *
   * @param applicationObject3D Contains all application meshes.
   *                            Computed communication is added to to object.
   */
  addCommunication(applicationObject3D: ApplicationObject3D,
    drawableClassCommunications: DrawableClassCommunication[]) {
    const application = applicationObject3D.dataModel;
    const applicationLayout = applicationObject3D.boxLayoutMap.get(application.id);

    if (!applicationLayout) { return; }

    const viewCenterPoint = applicationLayout.center;

    // Remove old communication
    applicationObject3D.removeAllCommunication();

    // Compute communication Layout
    const commLayoutMap = applyCommunicationLayout(applicationObject3D,
      applicationObject3D.boxLayoutMap, drawableClassCommunications);

    // Retrieve color preferences
    const {
      communication: communicationColor,
      highlightedEntity: highlightedEntityColor,
    } = this.configuration.applicationColors;

    // Render all drawable communications
    drawableClassCommunications.forEach((drawableClazzComm) => {
      const commLayout = commLayoutMap.get(drawableClazzComm.id);

      // No layouting information available due to hidden communication
      if (!commLayout) {
        return;
      }

      // Add communication to application
      const pipe = new ClazzCommunicationMesh(commLayout, drawableClazzComm,
        communicationColor, highlightedEntityColor);

      const curveHeight = this.computeCurveHeight(commLayout);

      pipe.render(viewCenterPoint, curveHeight);

      applicationObject3D.add(pipe);

      this.addArrows(pipe, curveHeight, viewCenterPoint);
    });
  }
}
