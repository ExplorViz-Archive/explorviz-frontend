import THREE from "three";
import BoxLayout from "../layout-models/box-layout";
import CommunicationLayout from "../layout-models/communication-layout";
import FoundationMesh from "../3d/application/foundation-mesh";
import Application from "explorviz-frontend/models/application";
import Component from "explorviz-frontend/models/component";
import Clazz from "explorviz-frontend/models/clazz";
import ComponentMesh from "../3d/application/component-mesh";
import DrawableClazzCommunication from "explorviz-frontend/models/drawableclazzcommunication";

type layoutSegment = {
  parent: null | layoutSegment,
  lowerChild: null | layoutSegment,
  upperRightChild: null | layoutSegment,
  startX: number,
  startZ: number,
  width: number,
  height: number,
  used: boolean
}

export function applyBoxLayout(application: Application) {

  const INSET_SPACE = 4.0;

  const components = application.get('components');

  const foundationComponent = components.objectAt(0);

  if (!foundationComponent) {
    return;
  }

  let layoutMap = new Map();

  application.getAllClazzes().forEach((clazz) => {
    layoutMap.set(clazz.get('id'), new BoxLayout(clazz));
  });

  application.getAllComponents().forEach((component) => {
    layoutMap.set(component.get('id'), new BoxLayout(component));
  });

  calcClazzHeight(foundationComponent);
  initNodes(foundationComponent);

  doLayout(foundationComponent);
  setAbsoluteLayoutPosition(foundationComponent);

  return layoutMap;

  // Helper functions

  function setAbsoluteLayoutPosition(component: Component) {
    const childComponents = component.get('children');
    const clazzes = component.get('clazzes');

    let componentLayout = layoutMap.get(component.get('id'));

    childComponents.forEach((childComponent) => {
      let childCompLayout = layoutMap.get(childComponent.get('id'));
      childCompLayout.positionX = childCompLayout.positionX + componentLayout.positionX;
      childCompLayout.positionY += componentLayout.positionY + 0.75 * 2.0;
      childCompLayout.positionZ = childCompLayout.positionZ + componentLayout.positionZ;
      setAbsoluteLayoutPosition(childComponent);
    });


    clazzes.forEach((clazz) => {
      let clazzLayout = layoutMap.get(clazz.get('id'));
      clazzLayout.positionX = clazzLayout.positionX + componentLayout.positionX;
      clazzLayout.positionY = clazzLayout.positionY + componentLayout.positionY;
      clazzLayout.positionY = clazzLayout.positionY + 0.75 * 2.0;
      clazzLayout.positionZ = clazzLayout.positionZ + componentLayout.positionZ;
    });
  }


  function calcClazzHeight(component: Component) {

    const CLAZZ_SIZE_DEFAULT = 0.05;
    const CLAZZ_SIZE_EACH_STEP = 1.1;

    const clazzes: Clazz[] = [];
    getClazzList(component, clazzes);

    const instanceCountList: number[] = [];

    clazzes.forEach((clazz) => {
      instanceCountList.push(clazz.get('instanceCount'));
    });

    const categories = getCategories(instanceCountList, false);

    clazzes.forEach((clazz) => {
      let clazzData = layoutMap.get(clazz.get('id'));
      clazzData.height = (CLAZZ_SIZE_EACH_STEP * categories[clazz.get('instanceCount')] + CLAZZ_SIZE_DEFAULT) * 2.0;
    });
  }


  function getCategories(list: number[], linear: boolean) {
    const result: number[] = [];

    if (list.length === 0) {
      return result;
    }

    list.sort();

    if (linear) {
      const listWithout0: number[] = [];

      list.forEach((entry) => {
        if (entry !== 0) {
          listWithout0.push(entry);
        }
      });

      if (listWithout0.length === 0) {
        result.push(0.0);
        return result;
      }
      useLinear(listWithout0, list, result);
    }
    else {
      const listWithout0And1: number[] = [];

      list.forEach((entry) => {
        if (entry !== 0 && entry !== 1) {
          listWithout0And1.push(entry);
        }
      });

      if (listWithout0And1.length === 0) {
        result.push(0.0);
        result.push(1.0);
        return result;
      }

      useThreshholds(listWithout0And1, list, result);
    }

    return result;



    // inner helper functions

    function useThreshholds(listWithout0And1: number[], list: number[], result: number[]) {
      let max = 1;

      listWithout0And1.forEach((value) => {
        if (value > max) {
          max = value;
        }
      });

      const oneStep = max / 3.0;

      const t1 = oneStep;
      const t2 = oneStep * 2;

      list.forEach((entry) => {
        let categoryValue = getCategoryFromValues(entry, t1, t2);
        result[entry] = categoryValue;
      });

    }


    function getCategoryFromValues(value: number, t1: number, t2: number) {
      if (value === 0) {
        return 0.0;
      } else if (value === 1) {
        return 1.0;
      }

      if (value <= t1) {
        return 2.0;
      } else if (value <= t2) {
        return 3.0;
      } else {
        return 4.0;
      }
    }


    function useLinear(listWithout0: number[], list: number[], result: number[]) {
      let max = 1;
      let secondMax = 1;

      listWithout0.forEach((value) => {
        if (value > max) {
          secondMax = max;
          max = value;
        }
      });

      const oneStep = secondMax / 4.0;

      const t1 = oneStep;
      const t2 = oneStep * 2;
      const t3 = oneStep * 3;

      list.forEach((entry) => {
        const categoryValue = getCategoryFromLinearValues(entry, t1, t2, t3);
        result[entry] = categoryValue;
      });

    }


    function getCategoryFromLinearValues(value: number, t1: number, t2: number, t3: number) {
      if (value <= 0) {
        return 0;
      } else if (value <= t1) {
        return 1.5;
      } else if (value <= t2) {
        return 2.5;
      } else if (value <= t3) {
        return 4.0;
      } else {
        return 6.5;
      }
    }



  } // END getCategories


  function getClazzList(component: Component, clazzesArray: Clazz[]) {
    const children = component.get('children');
    const clazzes = component.get('clazzes');

    children.forEach((child) => {
      getClazzList(child, clazzesArray);
    });

    clazzes.forEach((clazz) => {
      clazzesArray.push(clazz);
    });
  }


  function initNodes(component: Component) {
    const children = component.get('children');
    const clazzes = component.get('clazzes');

    const clazzWidth = 2.0;

    children.forEach((child) => {
      initNodes(child);
    });

    clazzes.forEach((clazz) => {
      let clazzData = layoutMap.get(clazz.get('id'));
      clazzData.depth = clazzWidth;
      clazzData.width = clazzWidth;
    });

    let componentData = layoutMap.get(component.get('id'));
    componentData.height = getHeightOfComponent(component);
    componentData.width = -1.0;
    componentData.depth = -1.0;
  }


  function getHeightOfComponent(component: Component) {
    const floorHeight = 0.75 * 4.0;

    let childrenHeight = floorHeight;

    const children = component.get('children');
    const clazzes = component.get('clazzes');

    clazzes.forEach((clazz) => {
      let clazzData = layoutMap.get(clazz.get('id'));
      const height = clazzData.height;
      if (height > childrenHeight) {
        childrenHeight = height;
      }
    });

    children.forEach((child) => {
      let childData = layoutMap.get(child.get('id'));
      if (childData.height > childrenHeight) {
        childrenHeight = childData.height;
      }
    });

    return childrenHeight + 0.1;
  }


  function doLayout(component: Component) {
    const children = component.get('children');

    children.forEach((child) => {
      doLayout(child);
    });

    layoutChildren(component);
  }


  function layoutChildren(component: Component) {
    let tempList: (Clazz | Component)[] = [];

    const children = component.get('children');
    const clazzes = component.get('clazzes');

    clazzes.forEach((clazz) => {
      tempList.push(clazz);
    });

    children.forEach((child) => {
      tempList.push(child);
    });

    const segment = layoutGeneric(tempList);

    let componentData = layoutMap.get(component.get('id'));
    componentData.width = segment.width;
    componentData.depth = segment.height;
  }


  function layoutGeneric(children: (Clazz | Component)[]) {
    const rootSegment = createRootSegment(children);

    let maxX = 0.0;
    let maxZ = 0.0;

    // Sort by width and by name (for entities with same width)
    children.sort(function (e1: any, e2: any) {
      let e1Width = layoutMap.get(e1.get('id')).width;
      let e2Width = layoutMap.get(e2.get('id')).width;
      const result = e1Width - e2Width;

      if ((-0.00001 < result) && (result < 0.00001)) {
        return e1.name.localeCompare(e2.name);
      }

      if (result < 0) {
        return 1;
      } else {
        return -1;
      }
    });

    children.forEach((child: any) => {
      let childData = layoutMap.get(child.get('id'));
      const childWidth = (childData.width + INSET_SPACE * 2);
      const childHeight = (childData.depth + INSET_SPACE * 2);
      childData.positionY = 0.0;

      const foundSegment = insertFittingSegment(rootSegment, childWidth, childHeight);

      if (foundSegment) {
        childData.positionX = foundSegment.startX + INSET_SPACE;
        childData.positionZ = foundSegment.startZ + INSET_SPACE;

        if (foundSegment.startX + childWidth > maxX) {
          maxX = foundSegment.startX + childWidth;
        }
        if (foundSegment.startZ + childHeight > maxZ) {
          maxZ = foundSegment.startZ + childHeight;
        }
      }
    });

    rootSegment.width = maxX;
    rootSegment.height = maxZ;

    // add labelInset space

    const labelInsetSpace = 8.0;

    children.forEach((child: any) => {
      let childData = layoutMap.get(child.get('id'));
      childData.positionX = childData.positionX + labelInsetSpace;
    });

    rootSegment.width = rootSegment.width + labelInsetSpace;

    return rootSegment;


    function insertFittingSegment(rootSegment: layoutSegment, toFitWidth: number, toFitHeight: number): null | layoutSegment {
      if (!rootSegment.used && toFitWidth <= rootSegment.width && toFitHeight <= rootSegment.height) {
        const resultSegment = createLayoutSegment();
        rootSegment.upperRightChild = createLayoutSegment();
        rootSegment.lowerChild = createLayoutSegment();

        resultSegment.startX = rootSegment.startX;
        resultSegment.startZ = rootSegment.startZ;
        resultSegment.width = toFitWidth;
        resultSegment.height = toFitHeight;
        resultSegment.parent = rootSegment;

        rootSegment.upperRightChild.startX = rootSegment.startX + toFitWidth;
        rootSegment.upperRightChild.startZ = rootSegment.startZ;
        rootSegment.upperRightChild.width = rootSegment.width - toFitWidth;
        rootSegment.upperRightChild.height = toFitHeight;
        rootSegment.upperRightChild.parent = rootSegment;

        if (rootSegment.upperRightChild.width <= 0.0) {
          rootSegment.upperRightChild = null;
        }

        rootSegment.lowerChild.startX = rootSegment.startX;
        rootSegment.lowerChild.startZ = rootSegment.startZ + toFitHeight;
        rootSegment.lowerChild.width = rootSegment.width;
        rootSegment.lowerChild.height = rootSegment.height - toFitHeight;
        rootSegment.lowerChild.parent = rootSegment;

        if (rootSegment.lowerChild.height <= 0.0) {
          rootSegment.lowerChild = null;
        }

        rootSegment.used = true;
        return resultSegment;
      }
      else {
        let resultFromUpper = null;
        let resultFromLower = null;

        if (rootSegment.upperRightChild != null) {
          resultFromUpper = insertFittingSegment(rootSegment.upperRightChild, toFitWidth, toFitHeight);
        }

        if (rootSegment.lowerChild != null) {
          resultFromLower = insertFittingSegment(rootSegment.lowerChild, toFitWidth, toFitHeight);
        }

        if (resultFromUpper == null) {
          return resultFromLower;
        } else if (resultFromLower == null) {
          return resultFromUpper;
        } else {
          // choose best fitting square
          const upperBoundX = resultFromUpper.startX + resultFromUpper.width;

          const lowerBoundZ = resultFromLower.startZ + resultFromLower.height;

          if (upperBoundX <= lowerBoundZ && resultFromLower.parent) {
            resultFromLower.parent.used = false;
            return resultFromUpper;
          } else if (resultFromUpper.parent) {
            resultFromUpper.parent.used = false;
            return resultFromLower;
          } else {
            return null;
          }
        }
      }
    }

  } // END layoutGeneric


  function createRootSegment(children: (Clazz | Component)[]) {
    let worstCaseWidth = 0.0;
    let worstCaseHeight = 0.0;

    children.forEach((child: any) => {
      let childData = layoutMap.get(child.get('id'));
      worstCaseWidth += childData.width + INSET_SPACE * 2;
      worstCaseHeight += childData.depth + INSET_SPACE * 2;
    });


    const rootSegment = createLayoutSegment();

    rootSegment.startX = 0.0;
    rootSegment.startZ = 0.0;

    rootSegment.width = worstCaseWidth;
    rootSegment.height = worstCaseHeight;

    return rootSegment;
  }


  function createLayoutSegment(): layoutSegment {
    const layoutSegment =
    {
      parent: null,
      lowerChild: null,
      upperRightChild: null,
      startX: 0,
      startZ: 0,
      width: 1,
      height: 1,
      used: false
    };

    return layoutSegment;
  } // END createLayoutSegment

}

// Communication Layouting //


export function applyCommunicationLayout(application: Application,
  boxLayoutMap: Map<string, BoxLayout>, modelIdToMesh: Map<string, THREE.Mesh>) {

  let layoutMap: Map<string, CommunicationLayout> = new Map();

  layoutEdges(application);

  const drawableClazzCommunications = application.get('drawableClazzCommunications');

  drawableClazzCommunications.forEach((clazzcommunication) => {
    let foundation = application.get('components').objectAt(0);
    if (layoutMap.has(clazzcommunication.get('id')) && foundation) {
      layoutDrawableCommunication(clazzcommunication, foundation);
    }
  });

  return layoutMap;

  // HELPER FUNCTIONS

  function layoutEdges(application: Application) {

    const drawableClazzCommunications = application.get('drawableClazzCommunications');

    drawableClazzCommunications.forEach((clazzCommunication) => {
      let parentComponent = clazzCommunication.get('parentComponent');
      let parentMesh = modelIdToMesh.get(parentComponent.get('id'));

      if (parentMesh instanceof ComponentMesh && parentMesh.opened) {
        layoutMap.set(clazzCommunication.get('id'), new CommunicationLayout(clazzCommunication));

        let sourceEntity: any = null;
        let targetEntity: any = null;

        let sourceParent = clazzCommunication.get('sourceClazz').get('parent');
        let sourceParentMesh = modelIdToMesh.get(sourceParent.get('id'));

        // Determine where the communication should begin (clazz or component - based upon their visiblity)
        if (sourceParentMesh instanceof ComponentMesh && sourceParentMesh.opened) {
          sourceEntity = clazzCommunication.get('sourceClazz');
        } else {
          sourceEntity = findFirstParentOpenComponent(clazzCommunication.get('sourceClazz').get('parent'));
        }


        let targetParent = clazzCommunication.get('targetClazz').get('parent');
        let targetParentMesh = modelIdToMesh.get(targetParent.get('id'));

        // Determine where the communication should end (clazz or component - based upon their visiblity)
        if (targetParentMesh instanceof ComponentMesh && targetParentMesh.opened) {
          targetEntity = clazzCommunication.get('targetClazz');
        } else {
          targetEntity = findFirstParentOpenComponent(clazzCommunication.get('targetClazz').get('parent'));
        }

        if (sourceEntity && targetEntity) {
          let commLayout = layoutMap.get(clazzCommunication.get('id'));
          let sourceLayout = boxLayoutMap.get(sourceEntity.get('id'));
          let targetLayout = boxLayoutMap.get(targetEntity.get('id'));

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

      calculatePipeSizeFromQuantiles(application);
    });

    // Calculates the size of the pipes regarding the number of requests
    function calculatePipeSizeFromQuantiles(application: Application) {

      // Constant factors for rendering communication lines (pipes)
      const PIPE_SIZE_EACH_STEP = 0.15;
      const PIPE_SIZE_DEFAULT = 0.1;

      const requestsList = gatherRequestsIntoList(application);
      const categories = calculateCategories(requestsList);
      const drawableClazzCommunications = application.get('drawableClazzCommunications');

      drawableClazzCommunications.forEach((clazzCommunication) => {
        if (layoutMap.has(clazzCommunication.get('id'))) {
          // Contains a number from 0 to 3 depending on the number of requests
          const calculatedCategory = getMatchingCategory(clazzCommunication.get('requests'), categories);
          
          let communicationData = layoutMap.get(clazzCommunication.get('id'));
          if (communicationData) {
            communicationData.lineThickness = (calculatedCategory * PIPE_SIZE_EACH_STEP) + PIPE_SIZE_DEFAULT;
          }
        }
      });

      // Generates four default categories for rendering (thickness of communication lines)
      function calculateCategories(requestsList: number[]) {
        const MIN = Math.min(...requestsList);
        const AVERAGE = requestsList.reduce((a, b) => a + b) / requestsList.length;
        const MAX = Math.max(...requestsList);
        const categories = [0, MIN, AVERAGE, MAX];

        return categories;
      }

      // Retrieves a matching category for a specific clazzCommunication
      function getMatchingCategory(numOfRequests: number, categories: number[]) {

        // default category = lowest category
        let calculatedCategory = 0;

        for (let i = 0; i < categories.length; i++) {
          if (numOfRequests >= categories[i]) {
            calculatedCategory = i;
          }
          else {
            break;
          }
        }

        return calculatedCategory;
      }

      // Retrieves all requests and pushes them to a list for further processing
      function gatherRequestsIntoList(application: Application) {

        let requestsList: number[] = [];
        const drawableClazzCommunications = application.get('drawableClazzCommunications');

        drawableClazzCommunications.forEach((clazzCommunication) => {
          if ((clazzCommunication.get('sourceClazz') !== clazzCommunication.get('targetClazz'))) {
            requestsList.push(clazzCommunication.get('requests'));
          }
        });

        return requestsList;
      }

    } // END calculatePipeSizeFromQuantiles

    function findFirstParentOpenComponent(entity: Component): Component {
      let parentComponent: Component = entity.get('parentComponent');

      let parentMesh = modelIdToMesh.get(parentComponent.get('id'));
      if (parentMesh instanceof FoundationMesh ||
        (parentMesh instanceof ComponentMesh && parentMesh.opened)) {
        return entity;
      } else {
        return findFirstParentOpenComponent(entity.get('parentComponent'));
      }
    }

  } // END layoutEdges

  function layoutDrawableCommunication(commu: DrawableClazzCommunication, foundation: Component) {

    const externalPortsExtension = new THREE.Vector3(3.0, 3.5, 3.0);

    const centerCommuIcon =
      new THREE.Vector3(foundation.get('positionX') + foundation.get('extension').x * 2.0 +
        externalPortsExtension.x * 4.0, foundation.get('positionY') -
        foundation.get('extension').y + externalPortsExtension.y,
        foundation.get('positionZ') + foundation.get('extension').z * 2.0 -
        externalPortsExtension.z - 12.0);

    layoutInAndOutCommunication(commu, commu.get('sourceClazz'), centerCommuIcon);
  }

  function layoutInAndOutCommunication(commu: DrawableClazzCommunication, internalClazz: Clazz, centerCommuIcon: THREE.Vector3) {
    let communicationData = layoutMap.get(commu.get('id'));
    if (!communicationData) {
      return;
    }

    communicationData.pointsFor3D = [];
    communicationData.pointsFor3D.push(centerCommuIcon);

    if (internalClazz !== null) {
      const end = new THREE.Vector3();

      const centerPoint =
        new THREE.Vector3(internalClazz.get('positionX') +
          internalClazz.get('width') / 2.0,
          internalClazz.get('positionY') + internalClazz.get('height') / 2.0,
          internalClazz.get('positionZ') + internalClazz.get('depth') / 2.0);

      end.x = internalClazz.get('positionX') + internalClazz.get('width') / 2.0;
      end.y = centerPoint.y;
      end.z = internalClazz.get('positionZ') + internalClazz.get('depth') / 2.0;
      communicationData.pointsFor3D.push(end);
    }
  }

}
