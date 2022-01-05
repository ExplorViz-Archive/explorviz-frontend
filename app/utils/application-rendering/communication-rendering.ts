import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import applyCommunicationLayout from 'explorviz-frontend/utils/application-rendering/communication-layouter';
import Configuration from 'explorviz-frontend/services/configuration';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import CommunicationLayout from 'explorviz-frontend/view-objects/layout-models/communication-layout';
import UserSettings from 'explorviz-frontend/services/user-settings';
import { Vector3 } from 'three';
import HeatmapConfiguration from 'heatmap/services/heatmap-configuration';
import { DrawableClassCommunication } from '../landscape-rendering/class-communication-computer';

export default class CommunicationRendering {
  // Service to access preferences
  configuration: Configuration;

  heatmapConf: HeatmapConfiguration;

  userSettings: UserSettings;

  constructor(configuration: Configuration,
    userSettings: UserSettings, heatmapConf: HeatmapConfiguration) {
    this.configuration = configuration;
    this.userSettings = userSettings;
    this.heatmapConf = heatmapConf;
  }

  get appSettings() {
    return this.userSettings.applicationSettings;
  }

  private computeCurveHeight(commLayout: CommunicationLayout) {
    let baseCurveHeight = 20;

    if (this.configuration.commCurveHeightDependsOnDistance) {
      const classDistance = Math.hypot(
        commLayout.endX - commLayout.startX, commLayout.endZ - commLayout.startZ,
      );
      baseCurveHeight = classDistance * 0.5;
    }

    return baseCurveHeight * this.appSettings.curvyCommHeight.value;
  }

  // Add arrow indicators for drawable class communication
  private addArrows(pipe: ClazzCommunicationMesh, curveHeight: number, viewCenterPoint: Vector3) {
    const arrowOffset = 0.8;
    const arrowHeight = curveHeight / 2 + arrowOffset;
    const arrowThickness = this.appSettings.commArrowSize.value;
    const arrowColorHex = this.configuration.applicationColors.communicationArrowColor.getHex();

    if (arrowThickness > 0.0) {
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
    if (!this.configuration.isCommRendered) return;

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
    const { communicationColor, highlightedEntityColor } = this.configuration.applicationColors;

    const positionToClazzCommMeshMap = new Map<String, ClazzCommunicationMesh>();

    // Render all drawable communications
    drawableClassCommunications.forEach((drawableClazzComm) => {
      const commLayout = commLayoutMap.get(drawableClazzComm.id);

      // No layouting information available due to hidden communication
      if (!commLayout) {
        return;
      }

      const start = new Vector3();
      start.subVectors(commLayout.startPoint, viewCenterPoint);
      const startCoordsAsString = `${start.x}.${start.y}.${start.z}`;

      const end = new Vector3();
      end.subVectors(commLayout.endPoint, viewCenterPoint);
      const endCoordsAsString = `${end.x}.${end.y}.${end.z}`;

      const combinedCoordsAsString = startCoordsAsString + endCoordsAsString;

      // Check if pipe already exists for another method call
      if (positionToClazzCommMeshMap.get(combinedCoordsAsString)) {
        // exists, therefore update pipe with additional information
        const existingClazzCommuDataModel = positionToClazzCommMeshMap
          .get(combinedCoordsAsString)?.dataModel;

        if (existingClazzCommuDataModel) {
          // update existing clazz commu data model

          existingClazzCommuDataModel.drawableClassCommus.push(drawableClazzComm);
        }
      } else {
        // does not exist, therefore create pipe

        const clazzCommuMeshData = {
          drawableClassCommus: [drawableClazzComm],
          bidirectional: false,
        };

        const pipe = new ClazzCommunicationMesh(commLayout, clazzCommuMeshData,
          communicationColor, highlightedEntityColor);

        const curveHeight = this.computeCurveHeight(commLayout);

        pipe.render(viewCenterPoint, curveHeight);

        applicationObject3D.add(pipe);

        this.addArrows(pipe, curveHeight, viewCenterPoint);

        positionToClazzCommMeshMap.set(combinedCoordsAsString, pipe);

        if (this.heatmapConf.heatmapActive) {
          pipe.turnTransparent(0.1);
        }
      }
    });
  }
}
