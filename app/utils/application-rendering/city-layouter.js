import THREE from "three";

export default function applyCityLayout(application) {

    const insetSpace = 4.0;

    const components = application.get('components');

    const foundationComponent = components.objectAt(0);

    /*
    const EdgeState = {
      NORMAL: 'NORMAL',
      TRANSPARENT: 'TRANSPARENT',
      SHOW_DIRECTION_IN: 'SHOW_DIRECTION_IN',
      SHOW_DIRECTION_OUT: 'SHOW_DIRECTION_OUT',
      SHOW_DIRECTION_IN_AND_OUT: 'SHOW_DIRECTION_IN_AND_OUT',
      REPLAY_HIGHLIGHT: 'REPLAY_HIGHLIGHT',
      HIDDEN: 'HIDDEN'
    };
    */

    calcClazzHeight(foundationComponent);
    initNodes(foundationComponent);

    doLayout(foundationComponent);
    setAbsoluteLayoutPosition(foundationComponent);

    layoutEdges(application);

    const drawableClazzCommunications = application.get('drawableClazzCommunications');

    drawableClazzCommunications.forEach((clazzcommunication) => {
      layoutDrawableCommunication(clazzcommunication, application.get('components').objectAt(0));
    });


    // Helper functions

    function setAbsoluteLayoutPosition(component){
      const children = component.get('children');
      const clazzes = component.get('clazzes');

      children.forEach((child) => {
        child.set('positionX', child.get('positionX') + component.get('positionX'));
        child.set('positionY', child.get('positionY') + component.get('positionY'));
        if (component.get('opened')) {
          child.set('positionY', child.get('positionY') + component.get('height'));
        }
        child.set('positionZ', child.get('positionZ') + component.get('positionZ'));
        setAbsoluteLayoutPosition(child);
      });


      clazzes.forEach((clazz) => {
        clazz.set('positionX', clazz.get('positionX') + component.get('positionX'));
        clazz.set('positionY', clazz.get('positionY') + component.get('positionY'));
        if (component.get('opened')) {
          clazz.set('positionY', clazz.get('positionY') + component.get('height'));
        }
        clazz.set('positionZ', clazz.get('positionZ') + component.get('positionZ'));
      });
    }


    function calcClazzHeight(component) {

      const clazzSizeDefault = 0.05;
      const clazzSizeEachStep = 1.1;

      const clazzes = [];
      getClazzList(component, clazzes);

      const instanceCountList = [];

      clazzes.forEach((clazz) => {
        instanceCountList.push(clazz.get('instanceCount'));
      });

      const categories = getCategories(instanceCountList, false);

      clazzes.forEach((clazz) => {
        clazz.set('height', (clazzSizeEachStep * categories[clazz.get('instanceCount')] + clazzSizeDefault) * 4.0);
      });
    }


    function getCategories(list, linear) {
      const result = [];

      if (list.length === 0) {
        return result;
      }

      list.sort();

      if (linear) {
        const listWithout0 = [];

        list.forEach((entry) => {
          if (entry !== 0){
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
        const listWithout0And1 = [];

        list.forEach((entry) => {
          if (entry !== 0 && entry !== 1){
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

      function useThreshholds(listWithout0And1, list, result) {
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


      function getCategoryFromValues(value, t1, t2) {
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


      function useLinear(listWithout0, list, result) {
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


      function getCategoryFromLinearValues(value, t1, t2, t3) {
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


    function getClazzList(component, clazzesArray){
      const children = component.get('children');
      const clazzes = component.get('clazzes');

      children.forEach((child) => {
        getClazzList(child, clazzesArray);
      });

      clazzes.forEach((clazz) => {
        clazzesArray.push(clazz);
      });
    }


    function initNodes(component) {
      const children = component.get('children');
      const clazzes = component.get('clazzes');

      const clazzWidth = 2.0;

      children.forEach((child) => {
        initNodes(child);
      });

      clazzes.forEach((clazz) => {
        clazz.set('depth', clazzWidth);
        clazz.set('width', clazzWidth);
      });

      component.set('height', getHeightOfComponent(component));
      component.set('width', -1.0);
      component.set('depth', -1.0);
    }


    function getHeightOfComponent(component) {
      const floorHeight = 0.75 * 4.0;

      if (!component.get('opened')) {
        let childrenHeight = floorHeight;

        const children = component.get('children');
        const clazzes = component.get('clazzes');

        clazzes.forEach((clazz) => {
          if (clazz.get('height') > childrenHeight) {
            childrenHeight = clazz.get('height');
          }
        });

        children.forEach((child) => {
          if (child.get('height') > childrenHeight) {
            childrenHeight = child.get('height');
          }
        });

        return childrenHeight + 0.1;
      } else {
        return floorHeight;
      }
    }


    function doLayout(component) {
      const children = component.get('children');

      children.forEach((child) => {
        doLayout(child);
      });

      layoutChildren(component);
    }


    function layoutChildren(component) {
      let tempList = [];

      const children = component.get('children');
      const clazzes = component.get('clazzes');

      clazzes.forEach((clazz) => {
        tempList.push(clazz);
      });

      children.forEach((child) => {
        tempList.push(child);
      });

      const segment = layoutGeneric(tempList);

      component.set('width', segment.width);
      component.set('depth', segment.height);
    }


    function layoutGeneric(children) {
      const rootSegment = createRootSegment(children);

      let maxX = 0.0;
      let maxZ = 0.0;

      children.sort(function(e1, e2) {
        const result = e1.get('width') - e2.get('width');

        if ((-0.00001 < result) && (result < 0.00001)) {
          return e1.get('name').localeCompare(e2.get('name'));
        }

        if (result < 0) {
          return 1;
        } else {
          return -1;
        }
      });

      children.forEach((child) => {

        const childWidth = (child.get('width') + insetSpace * 2);
        const childHeight = (child.get('depth') + insetSpace * 2);
        child.set('positionY', 0.0);

        const foundSegment = insertFittingSegment(rootSegment, childWidth, childHeight);

        child.set('positionX', foundSegment.startX + insetSpace);
        child.set('positionZ', foundSegment.startZ + insetSpace);

        if (foundSegment.startX + childWidth > maxX) {
          maxX = foundSegment.startX + childWidth;
        }
        if (foundSegment.startZ + childHeight > maxZ) {
          maxZ = foundSegment.startZ + childHeight;
        }
      });

      rootSegment.width = maxX;
      rootSegment.height = maxZ;

      // add labelInset space

      const labelInsetSpace = 8.0;

      children.forEach((child) => {
        child.set('positionX', child.get('positionX') + labelInsetSpace);
      });

      rootSegment.width = rootSegment.width + labelInsetSpace;

      return rootSegment;


      function insertFittingSegment(rootSegment, toFitWidth, toFitHeight){
        if(!rootSegment.used && toFitWidth <= rootSegment.width && toFitHeight <= rootSegment.height) {
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

            if (upperBoundX <= lowerBoundZ) {
              resultFromLower.parent.used = false;
              return resultFromUpper;
            } else {
              resultFromUpper.parent.used = false;
              return resultFromLower;
            }
          }
        }
      }

    } // END layoutGeneric


    function createRootSegment(children) {
      let worstCaseWidth = 0.0;
      let worstCaseHeight = 0.0;

      children.forEach((child) => {
        worstCaseWidth = worstCaseWidth + (child.get('width') + insetSpace * 2);
        worstCaseHeight = worstCaseHeight + (child.get('depth') + insetSpace * 2);
      });


      const rootSegment = createLayoutSegment();

      rootSegment.startX = 0.0;
      rootSegment.startZ = 0.0;

      rootSegment.width = worstCaseWidth;
      rootSegment.height = worstCaseHeight;

      return rootSegment;
    }


    function createLayoutSegment() {
      const layoutSegment =
      {
        parent: null,
        lowerChild: null,
        upperRightChild: null,
        startX: null,
        startZ: null,
        width: null,
        height: null,
        used: false
      };

      return layoutSegment;
    } // END createLayoutSegment

    function layoutEdges(application) {

      const drawableClazzCommunications = application.get('drawableClazzCommunications');

      drawableClazzCommunications.forEach((clazzCommunication) => {
        if (!clazzCommunication.get('hidden')) {

          let sourceClazz = null;
          let targetClazz = null;

          if (clazzCommunication.get('sourceClazz').get('parent').get('opened')) {
            sourceClazz = clazzCommunication.get('sourceClazz');
          } else {
            sourceClazz = findFirstParentOpenComponent(clazzCommunication.get('sourceClazz').get('parent'));
          }

          if (clazzCommunication.get('targetClazz').get('parent').get('opened')) {
            targetClazz = clazzCommunication.get('targetClazz');
          }
          else {
            targetClazz = findFirstParentOpenComponent(clazzCommunication.get('targetClazz').get('parent'));
          }

          if (sourceClazz !== null && targetClazz !== null) {
              clazzCommunication.set('state', 'NORMAL');
              clazzCommunication.set('startPoint', new THREE.Vector3(sourceClazz.get('positionX') + sourceClazz.get('width') / 2.0, sourceClazz.get('positionY'), sourceClazz.get('positionZ') + sourceClazz.get('depth') / 2.0));
              clazzCommunication.set('endPoint', new THREE.Vector3(targetClazz.get('positionX') + targetClazz.get('width') / 2.0, targetClazz.get('positionY') + 0.05, targetClazz.get('positionZ') + targetClazz.get('depth') / 2.0));
          }
        }

        calculatePipeSizeFromQuantiles(application);
      });

      // Calculates the size of the pipes regarding the number of requests
      function calculatePipeSizeFromQuantiles(application) {

        // constant factors for rendering communication lines (pipes)
        const pipeSizeEachStep = 0.45;
        const pipeSizeDefault = 0.1;

        const requestsList = gatherRequestsIntoList(application);
        const categories = calculateCategories(requestsList);
        const drawableClazzCommunications = application.get('drawableClazzCommunications');

        drawableClazzCommunications.forEach((clazzCommunication) => {
          const calculatedCategory = getMatchingCategory(clazzCommunication.get('requests'), categories);
          clazzCommunication.set('lineThickness', (calculatedCategory  * pipeSizeEachStep) + pipeSizeDefault);
        });

        // generates four default categories for rendering (thickness of communication lines)
        function calculateCategories(requestsList) {
          const minNumber = Math.min.apply(Math, requestsList);
          const avgNumber = requestsList.reduce(addUpRequests) / requestsList.length;
          const maxNumber = Math.max.apply(Math,requestsList);
          const categories = [0, minNumber, avgNumber, maxNumber];

          return categories;
        } // END calculateCategories

        // retrieves a matching category for a specific clazzCommunication
        function getMatchingCategory(numOfRequests, categories) {

          // default category = lowest category
          let calculatedCategory = 0;

          for (var i = 1; i < categories.length; i++) {
            if (numOfRequests >= categories[i]) {
              calculatedCategory = i;
            }
            else {
              return calculatedCategory;
            }
          }
          return calculatedCategory;
        } // END getMatchingCategory

        // Retrieves all requests and pushes them to a list for further processing
        function gatherRequestsIntoList(application) {

          let requestsList = [];
          const drawableClazzCommunications = application.get('drawableClazzCommunications');

          drawableClazzCommunications.forEach((clazzCommunication) => {
            if ((clazzCommunication.get('sourceClazz') !== clazzCommunication.get('targetClazz'))) {
              requestsList.push(clazzCommunication.get('requests'));
            }
          });

          return requestsList;
        } // END gatherRequestsIntoList

        // adds up a number to an existing number
        function addUpRequests(requestSum, requestCount) {
          return requestSum + requestCount;
        } // END addUpRequests

      } // END calculatePipeSizeFromQuantiles

      function findFirstParentOpenComponent(entity) {
        if (entity.get('parentComponent') == null || entity.get('parentComponent').get('opened')) {
          return entity;
        }

        return findFirstParentOpenComponent(entity.get('parentComponent'));
      }

    } // END layoutEdges

    function layoutDrawableCommunication(commu, foundation) {

      const externalPortsExtension = new THREE.Vector3(3.0, 3.5, 3.0);

      const centerCommuIcon =
      new THREE.Vector3(foundation.get('positionX') + foundation.get('extension').x * 2.0 +
        externalPortsExtension.x * 4.0, foundation.get('positionY') -
        foundation.get('extension').y + externalPortsExtension.y,
        foundation.get('positionZ') + foundation.get('extension').z * 2.0 -
        externalPortsExtension.z - 12.0);

      layoutInAndOutCommunication(commu, commu.get('sourceClazz'), centerCommuIcon);
    }

    function layoutInAndOutCommunication(commu, internalClazz, centerCommuIcon) {

      commu.set('pointsFor3D', []);
      commu.get('pointsFor3D').push(centerCommuIcon);

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
        commu.get('pointsFor3D').push(end);
      }
    }

}
