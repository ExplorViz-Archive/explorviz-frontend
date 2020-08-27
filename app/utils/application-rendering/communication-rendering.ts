import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import applyCommunicationLayout from 'explorviz-frontend/utils/application-rendering/communication-layouter';
import Configuration from 'explorviz-frontend/services/configuration';
import CurrentUser from 'explorviz-frontend/services/current-user';
import BoxLayout from 'explorviz-frontend/view-objects/layout-models/box-layout';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';

export default class CommunicationRendering {
  // Service to access color preferences
  configuration: Configuration;

  // Used to access communication drawing preferences
  currentUser: CurrentUser;

  constructor(configuration: Configuration, currentUser: CurrentUser) {
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
  addCommunication(applicationObject3D: ApplicationObject3D) {
    const application = applicationObject3D.dataModel;
    const applicationLayout = applicationObject3D.getBoxLayout(application.id);

    if (!applicationLayout) { return; }

    const viewCenterPoint = applicationLayout.center;

    // Remove old communication
    applicationObject3D.removeAllCommunication();

    // Compute communication Layout
    const commLayoutMap = applyCommunicationLayout(applicationObject3D);

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

      applicationObject3D.add(pipe);

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
