import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import applyCommunicationLayout from 'explorviz-frontend/utils/application-rendering/communication-layouter';
import Configuration from 'explorviz-frontend/services/configuration';
import CurrentUser from 'explorviz-frontend/services/current-user';
import BoxLayout from 'explorviz-frontend/view-objects/layout-models/box-layout';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';

export default class CommunicationRendering {
  // Functions as parent object for all application objects
  applicationObject3D: ApplicationObject3D;

  // Service to access color preferences
  configuration: Configuration;

  // Used to access communication drawing preferences
  currentUser: CurrentUser;

  constructor(applicationObject3D: ApplicationObject3D, configuration: Configuration,
    currentUser: CurrentUser) {
    this.applicationObject3D = applicationObject3D;
    this.configuration = configuration;
    this.currentUser = currentUser;
  }

  /**
   * Computes commnication and communication arrows and adds them to the
   * applicationObject3D
   *
   * @param boxLayoutMap Contains box layout informationen which
   *                     is needed for the communication layouting
   */
  addCommunication(boxLayoutMap: Map<string, BoxLayout>) {
    const application = this.applicationObject3D.dataModel;
    const applicationLayout = boxLayoutMap.get(application.pid);

    if (applicationLayout === undefined) {
      return;
    }

    const viewCenterPoint = applicationLayout.center;

    // Remove old communication
    this.applicationObject3D.removeAllCommunication();

    // Compute communication Layout
    const commLayoutMap = applyCommunicationLayout(this.applicationObject3D, boxLayoutMap);

    // Retrieve color preferences
    const {
      communication: communicationColor,
      highlightedEntity: highlightedEntityColor,
      communicationArrow: arrowColor,
    } = this.configuration.applicationColors;

    // Retrieve curve preferences
    const maybeCurveHeight = this.currentUser.getPreferenceOrDefaultValue('rangesetting', 'appVizCurvyCommHeight');
    const curveHeight = typeof maybeCurveHeight === 'number' ? maybeCurveHeight : 0.0;
    const isCurved = curveHeight !== 0.0;

    const drawableClazzCommunications = application.get('drawableClazzCommunications');

    // Render all drawable communications
    drawableClazzCommunications.forEach((drawableClazzComm) => {
      const commLayout = commLayoutMap.get(drawableClazzComm.get('id'));

      // No layouting information available due to hidden communication
      if (!commLayout) {
        return;
      }

      // Add communication to application
      const pipe = new ClazzCommunicationMesh(commLayout, drawableClazzComm,
        communicationColor, highlightedEntityColor);

      pipe.render(viewCenterPoint, curveHeight);

      this.applicationObject3D.add(pipe);

      // Add arrow indicators for communication
      const ARROW_OFFSET = 0.8;
      const arrowHeight = isCurved ? curveHeight / 2 + ARROW_OFFSET : ARROW_OFFSET;
      const arrowThickness = this.currentUser.getPreferenceOrDefaultValue('rangesetting', 'appVizCommArrowSize');
      const arrowColorHex = arrowColor.getHex();

      if (typeof arrowThickness === 'number' && arrowThickness > 0.0) {
        pipe.addArrows(viewCenterPoint, arrowThickness, arrowHeight, arrowColorHex);
      }
    });
  }
}
