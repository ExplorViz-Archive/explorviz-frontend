import BaseMesh from 'explorviz-frontend/view-objects/3d/base-mesh';
import ClazzCommunicationMesh from 'explorviz-frontend/view-objects/3d/application/clazz-communication-mesh';
import Application from 'explorviz-frontend/models/application';
import THREE from 'three';
import { applyCommunicationLayout } from 'explorviz-frontend/utils/application-rendering/city-layouter';
import Configuration from 'explorviz-frontend/services/configuration';
import CurrentUser from 'explorviz-frontend/services/current-user';
import BoxLayout from 'explorviz-frontend/view-objects/layout-models/box-layout';


export default class CommunicationRendering {
  // References to mesh maps of rendering
  modelIdToMesh: Map<string, BaseMesh>;

  commIdToMesh: Map<string, ClazzCommunicationMesh>;

  // Functions as parent object for all application objects
  applicationObject3D: THREE.Object3D;

  // Service to access color preferences
  configuration: Configuration;

  // Used to access communication drawing preferences
  currentUser: CurrentUser;

  constructor(modelIdToMesh: Map<string, BaseMesh>, commIdToMesh: Map<string,
  ClazzCommunicationMesh>, applicationObject3D: THREE.Object3D, configuration: Configuration,
  currentUser: CurrentUser) {
    this.modelIdToMesh = modelIdToMesh;
    this.commIdToMesh = commIdToMesh;
    this.applicationObject3D = applicationObject3D;
    this.configuration = configuration;
    this.currentUser = currentUser;
  }

  addCommunication(application: Application, boxLayoutMap: Map<string, BoxLayout>) {
    const foundationData = boxLayoutMap.get(application.id);

    if (foundationData === undefined) {
      return;
    }

    const viewCenterPoint = foundationData.center;

    // Remove old communication
    this.removeAllCommunication();

    // Compute communication Layout
    const commLayoutMap = applyCommunicationLayout(application, boxLayoutMap, this.modelIdToMesh);

    // Retrieve color preferences
    const {
      communication: communicationColor,
      highlightedEntity: highlightedEntityColor,
      communicationArrow: arrowColorString,
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
        new THREE.Color(communicationColor), new THREE.Color(highlightedEntityColor));

      pipe.render(viewCenterPoint, curveHeight);

      this.applicationObject3D.add(pipe);
      this.commIdToMesh.set(drawableClazzComm.get('id'), pipe);

      // Add arrow indicators for communication
      const ARROW_OFFSET = 0.8;
      const arrowHeight = isCurved ? curveHeight / 2 + ARROW_OFFSET : ARROW_OFFSET;
      const arrowThickness = this.currentUser.getPreferenceOrDefaultValue('rangesetting', 'appVizCommArrowSize');
      const arrowColor = new THREE.Color(arrowColorString).getHex();

      if (typeof arrowThickness === 'number' && arrowThickness > 0.0) {
        pipe.addArrows(viewCenterPoint, arrowThickness, arrowHeight, arrowColor);
      }
    });
  }

  removeAllCommunication() {
    this.commIdToMesh.forEach((mesh: ClazzCommunicationMesh) => {
      mesh.delete();
    });
    this.commIdToMesh.clear();
  }
}
