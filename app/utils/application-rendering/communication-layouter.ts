import THREE from 'three';
import Component from 'explorviz-frontend/models/component';
import Clazz from 'explorviz-frontend/models/clazz';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';
import ApplicationObject3D from 'explorviz-frontend/view-objects/3d/application/application-object-3d';
import BoxLayout from 'explorviz-frontend/view-objects/layout-models/box-layout';
import ComponentMesh from '../../view-objects/3d/application/component-mesh';
import FoundationMesh from '../../view-objects/3d/application/foundation-mesh';
import CommunicationLayout from '../../view-objects/layout-models/communication-layout';

// Communication Layouting //
export default function applyCommunicationLayout(applicationObject3D: ApplicationObject3D) {
  const application = applicationObject3D.dataModel;

  const layoutMap: Map<string, CommunicationLayout> = new Map();

  // HELPER FUNCTIONS

  /**
   * Calculates the size of the pipes regarding the number of requests
   */
  function calculatePipeSizeFromQuantiles() {
    /**
     * Retrieves all requests and pushes them to a list for further processing
     */
    function gatherRequestsIntoList() {
      const requestsList: number[] = [];

      const drawableClazzCommunications = application.get('drawableClazzCommunications');

      // Generate a list with all requests
      drawableClazzCommunications.forEach((clazzCommunication) => {
        if ((clazzCommunication.get('sourceClazz') !== clazzCommunication.get('targetClazz'))) {
          requestsList.push(clazzCommunication.get('requests'));
        }
      });

      return requestsList;
    }

    /**
     * Generates four default categories (0, min, average, max)
     * for rendering (thickness of communication lines)
     *
     * @param requestsList A list with all existing request sizes
     */
    function calculateCategories(requestsList: number[]) {
      const MIN = Math.min(...requestsList);
      const AVERAGE = requestsList.reduce((a, b) => a + b) / requestsList.length;
      const MAX = Math.max(...requestsList);
      const categories = [0, MIN, AVERAGE, MAX];

      return categories;
    }

    /**
     * Retrieves a matching category for a specific clazzCommunication
     *
     * @param numOfRequests Number to compare with given categories
     * @param categories Contains numbers which act as thresholds for category assignment
     */
    function getMatchingCategory(numOfRequests: number, categories: number[]) {
      // default category = lowest category
      let calculatedCategory = 0;

      for (let i = 0; i < categories.length; i++) {
        if (numOfRequests >= categories[i]) {
          calculatedCategory = i;
        } else {
          break;
        }
      }

      return calculatedCategory;
    }

    // Constant factors for rendering communication lines (pipes)
    const PIPE_SIZE_EACH_STEP = 0.15;
    // Minimum pipe size which is applied for request category 0
    const PIPE_SIZE_DEFAULT = 0.1;

    const requestsList = gatherRequestsIntoList();
    const categories = calculateCategories(requestsList);
    const drawableClazzCommunications = application.get('drawableClazzCommunications');

    drawableClazzCommunications.forEach((clazzCommunication) => {
      const maybeCommunicationLayout = layoutMap.get(clazzCommunication.get('id'));

      if (maybeCommunicationLayout) {
        // Contains a number from 0 to 3 (category) depending on the number of requests
        const calculatedCategory = getMatchingCategory(clazzCommunication.get('requests'), categories);

        // Apply line thickness depending on calculated request category
        maybeCommunicationLayout.lineThickness = (calculatedCategory * PIPE_SIZE_EACH_STEP)
               + PIPE_SIZE_DEFAULT;
      }
    });
  } // END calculatePipeSizeFromQuantiles

  /**
   * Returns the first parent component which is open or - if it does not exist -
   * the root component (which has no parent itself)
   *
   * @param component Component for which an open parent shall be returned
   */
  function findFirstParentOpenComponent(component: Component): Component|null {
    const parentComponent: Component = component.getParentComponent();

    if (!parentComponent) return component;

    // Check open status in corresponding component mesh
    const parentMesh = applicationObject3D.getBoxMeshbyModelId(parentComponent.get('id'));
    if (parentMesh instanceof ComponentMesh && parentMesh.opened) {
      return component;
    }

    // Recursive call
    return findFirstParentOpenComponent(parentComponent);
  }

  /**
  * Calculates start and end positions for all drawable communications
  */
  function layoutEdges() {
    const drawableClazzCommunications = application.hasMany('drawableClazzCommunications').value();

    if (!drawableClazzCommunications) { return; }

    for (let i = 0; i < drawableClazzCommunications.length; i++) {
      const clazzCommunication: DrawableClazzCommunication = drawableClazzCommunications
        .objectAt(i);

      const parentComponent = clazzCommunication.get('parentComponent');

      let parentMesh;

      if (parentComponent === null) {
        // common ancestor must be the foundation
        parentMesh = applicationObject3D.getBoxMeshbyModelId(application.get('id'));
      } else {
        parentMesh = applicationObject3D.getBoxMeshbyModelId(parentComponent.get('id'));
      }

      if ((parentMesh instanceof ComponentMesh && parentMesh.opened)
      || parentMesh instanceof FoundationMesh) {
        layoutMap.set(clazzCommunication.get('id'), new CommunicationLayout(clazzCommunication));

        let sourceEntity: any = null;
        let targetEntity: any = null;

        const sourceClazz = clazzCommunication.belongsTo('sourceClazz').value() as Clazz|null;
        const targetClazz = clazzCommunication.belongsTo('targetClazz').value() as Clazz|null;

        if (sourceClazz && targetClazz) {
          const sourceParent = sourceClazz.belongsTo('parent').value() as Component;
          const sourceParentMesh = applicationObject3D.getBoxMeshbyModelId(sourceParent.get('id'));

          // Determine where the communication should begin
          // (clazz or component - based upon their visiblity)
          if (sourceParentMesh instanceof ComponentMesh && sourceParentMesh.opened) {
            sourceEntity = clazzCommunication.get('sourceClazz');
          } else {
            sourceEntity = findFirstParentOpenComponent(sourceParent);
          }

          const targetParent = targetClazz.belongsTo('parent').value() as Component;
          const targetParentMesh = applicationObject3D.getBoxMeshbyModelId(targetParent.get('id'));

          // Determine where the communication should end
          // (clazz or component - based upon their visiblity)
          if (targetParentMesh instanceof ComponentMesh && targetParentMesh.opened) {
            targetEntity = clazzCommunication.get('targetClazz');
          } else {
            targetEntity = findFirstParentOpenComponent(targetParent);
          }

          if (sourceEntity && targetEntity) {
            const commLayout = layoutMap.get(clazzCommunication.get('id'));
            const sourceLayout = applicationObject3D.getBoxLayout(sourceEntity.get('id'));
            const targetLayout = applicationObject3D.getBoxLayout(targetEntity.get('id'));

            if (commLayout && sourceLayout && targetLayout) {
              commLayout.startX = sourceLayout.positionX + sourceLayout.width / 2.0;
              commLayout.startY = sourceLayout.positionY;
              commLayout.startZ = sourceLayout.positionZ + sourceLayout.depth / 2.0;

              commLayout.endX = targetLayout.positionX + targetLayout.width / 2.0;
              commLayout.endY = targetLayout.positionY + 0.05;
              commLayout.endZ = targetLayout.positionZ + targetLayout.depth / 2.0;
            }
          }
        }

        calculatePipeSizeFromQuantiles();
      }
    }
  }

  function layoutInAndOutCommunication(commu: DrawableClazzCommunication,
    internalClazz: Clazz, centerCommuIcon: THREE.Vector3) {
    const communicationData = layoutMap.get(commu.get('id'));
    if (!communicationData) {
      return;
    }

    communicationData.pointsFor3D = [];
    communicationData.pointsFor3D.push(centerCommuIcon);

    if (internalClazz !== null) {
      const end = new THREE.Vector3();

      const clazzBoxLayout = applicationObject3D.getBoxLayout(internalClazz.get('id'));
      if (!clazzBoxLayout) { return; }

      const centerPoint = new THREE.Vector3(clazzBoxLayout.positionX
          + clazzBoxLayout.width / 2.0,
      clazzBoxLayout.positionY + clazzBoxLayout.height / 2.0,
      clazzBoxLayout.positionZ + clazzBoxLayout.depth / 2.0);

      end.x = clazzBoxLayout.positionX + clazzBoxLayout.width / 2.0;
      end.y = centerPoint.y;
      end.z = clazzBoxLayout.positionZ + clazzBoxLayout.depth / 2.0;
      communicationData.pointsFor3D.push(end);
    }
  }

  function layoutDrawableCommunication(commu: DrawableClazzCommunication,
    foundationLayout: BoxLayout) {
    const externalPortsExtension = new THREE.Vector3(3.0, 3.5, 3.0);

    if (!foundationLayout) { return; }

    const centerCommuIcon = new THREE.Vector3(
      foundationLayout.positionX + foundationLayout.width * 2.0 + externalPortsExtension.x * 4.0,
      foundationLayout.positionY - foundationLayout.height + externalPortsExtension.y,
      foundationLayout.positionZ + foundationLayout.depth * 2.0 - externalPortsExtension.z - 12.0,
    );

    layoutInAndOutCommunication(commu, commu.get('sourceClazz'), centerCommuIcon);
  }

  layoutEdges();

  const drawableClazzCommunications = application.get('drawableClazzCommunications');

  drawableClazzCommunications.forEach((clazzcommunication) => {
    const foundationLayout = applicationObject3D.getBoxLayout(application.id);
    if (layoutMap.has(clazzcommunication.get('id')) && foundationLayout) {
      layoutDrawableCommunication(clazzcommunication, foundationLayout);
    }
  });

  return layoutMap;
}
