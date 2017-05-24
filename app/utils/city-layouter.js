export default function applyCityLayout(application) {

    const insetSpace = 4.0;

    const components = application.get('components');
    
    const foundationComponent = components.objectAt(0);

    const EdgeState = {
      NORMAL: 'NORMAL', 
      TRANSPARENT: 'TRANSPARENT', 
      SHOW_DIRECTION_IN: 'SHOW_DIRECTION_IN', 
      SHOW_DIRECTION_OUT: 'SHOW_DIRECTION_OUT', 
      SHOW_DIRECTION_IN_AND_OUT: 'SHOW_DIRECTION_IN_AND_OUT', 
      REPLAY_HIGHLIGHT: 'REPLAY_HIGHLIGHT', 
      HIDDEN: 'HIDDEN'
    };

    calcClazzHeight(foundationComponent);
    initNodes(foundationComponent);

    doLayout(foundationComponent);
    setAbsoluteLayoutPosition(foundationComponent);

    layoutEdges(application);

    const incomingCommunications = application.get('incomingCommunications');

    incomingCommunications.forEach((commu) => {
      layoutIncomingCommunication(commu, application.get('components').objectAt(0));
    });

    const outgoingCommunications = application.get('outgoingCommunications');

    outgoingCommunications.forEach((commu) => {
      layoutOutgoingCommunication(commu, application.get('components').objectAt(0));
    });



    // Helper functions

    function setAbsoluteLayoutPosition(component){
      const children = component.get('children');
      const clazzes = component.get('clazzes');

      children.forEach((child) => {
        child.set('positionX', child.get('positionX') + component.get('positionX'));
        child.set('positionY', child.get('positionY') + component.get('positionY'));
        if (component.opened) {
          child.set('positionY', child.get('positionY') + component.get('height'));
        }
        child.set('positionZ', child.get('positionZ') + component.get('positionZ'));
        setAbsoluteLayoutPosition(child);
      });


      clazzes.forEach((clazz) => {
        clazz.set('positionX', clazz.get('positionX') + component.get('positionX'));
        clazz.set('positionY', clazz.get('positionY') + component.get('positionY'));
        if (component.opened) {
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
          result.push({0: 0.0});
          return result;
        }        
        useLinear(listWithout0, list, result);
      } 
      else {
        const listWithout0And1 = [];

        let outsideCounter = 0;
        let insideCounter = 0;

        list.forEach((entry) => {
          outsideCounter++;
          if (entry !== 0 && entry !== 1){
            listWithout0And1.push(entry);
            insideCounter++;
          }
        });

        if (listWithout0And1.length === 0) {
          result.push({0: 0.0});
          result.push({1: 1.0});
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
    }

    function layoutEdges(application) {

      application.set('communicationsAccumulated', []);

      const communications = application.get('communications');

      communications.forEach((commuFromApp) => {
        if (!commuFromApp.get('hidden')) {

          let source = null;
          let target = null;

          if (commuFromApp.get('source').get('parent').get('opened')) {
            source = commuFromApp.get('source');
          } else {
            source = findFirstParentOpenComponent(commuFromApp.get('source').get('parent'));
          }

          if (commuFromApp.get('target').get('parent').get('opened')) {
            target = commuFromApp.get('target');
          }
          else {
            target = findFirstParentOpenComponent(commuFromApp.get('target').get('parent'));
          }

          if (source !== null && target !== null) {

            let found = false;

            const communicationsAccumulated = application.get('communicationsAccumulated');

             communicationsAccumulated.forEach((commuAcc) => {

              if (found === false) {
                found = ((commuAcc.source === source) && (commuAcc.target === target) ||
                  (commuAcc.source === target) && (commuAcc.target === source));

                  if (found) {
                    commuAcc.requests = commuAcc.requests + commuFromApp.get('requestsCacheCount');
                    commuAcc.aggregatedCommunications.push(commuFromApp);
                  }
                }

             });


              if (found === false) {
                const newCommu = {};
                newCommu.source = source;
                newCommu.target = target;
                newCommu.requests = commuFromApp.get('requestsCacheCount');
                newCommu.aggregatedCommunications = [];
                newCommu.state = 'NORMAL';

                newCommu.startPoint = new THREE.Vector3(source.get('positionX') + source.get('width') / 2.0, source.get('positionY'),
                  source.get('positionZ') + source.get('depth') / 2.0);
               
                newCommu.endPoint = new THREE.Vector3(target.get('positionX') + target.get('width') / 2.0, target.get('positionY') + 0.05,
                  target.get('positionZ') + target.get('depth') / 2.0);              

                newCommu.aggregatedCommunications.push(commuFromApp);

                application.get('communicationsAccumulated').push(newCommu);
              }
          }          

        }

        calculatePipeSizeFromQuantiles(application);

      });


      function calculatePipeSizeFromQuantiles(application) {

        const requestsList = [];

        const pipeSizeEachStep = 0.45;
        const pipeSizeDefault = 0.1;

        gatherRequestsIntoList(application, requestsList);

        const categories = getCategories(requestsList, true);
        
        const communicationsAccumulated = application.get('communicationsAccumulated');

        communicationsAccumulated.forEach((commu) => {
          if (commu.source !== commu.target && commu.state !== EdgeState.HIDDEN) {
            commu.pipeSize = categories[commu.requests] * pipeSizeEachStep + pipeSizeDefault;
          }
        });

        const incomingCommunications = application.get('incomingCommunications');

        incomingCommunications.forEach((commu) => {
          commu.lineThickness = categories[commu.requests] * pipeSizeEachStep + pipeSizeDefault;
        });

        const outgoingCommunications = application.get('outgoingCommunications');

        outgoingCommunications.forEach((commu) => {
          commu.lineThickness = categories[commu.requests] * pipeSizeEachStep + pipeSizeDefault;
        });



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
              result.push({0: 0.0});
              return result;
            }        
            useLinear(listWithout0, list, result);
          } 
          else {
            const listWithout0And1 = [];

            let outsideCounter = 0;
            let insideCounter = 0;

            list.forEach((entry) => {
              outsideCounter++;
              if (entry !== 0 && entry !== 1){
                listWithout0And1.push(entry);
                insideCounter++;
              }
            });

            if (listWithout0And1.length === 0) {
              result.push({0: 0.0});
              result.push({1: 1.0});
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


        function gatherRequestsIntoList(application, requestsList) {

          const communicationsAccumulated = application.get('communicationsAccumulated');

          communicationsAccumulated.forEach((commu) => {
            if (commu.source !== commu.target && commu.state !== EdgeState.HIDDEN) {
              requestsList.push(commu.requests);
            }
          });

          const incomingCommunications = application.get('incomingCommunications');

          incomingCommunications.forEach((commu) => {
            requestsList.push(commu.requests);
          });

          const outgoingCommunications = application.get('outgoingCommunications');

          outgoingCommunications.forEach((commu) => {
            requestsList.push(commu.requests);
          });

        }

      }// END calculatePipeSizeFromQuantiles 

      function findFirstParentOpenComponent(entity) {
        if (entity.get('parentComponent') == null || entity.get('parentComponent').get('opened')) {
          return entity;
        }

        return findFirstParentOpenComponent(entity.get('parentComponent'));
      }
      

    } // END layoutEdges


    function layoutIncomingCommunication(commu, foundation) {

      const externalPortsExtension = new THREE.Vector3(3.0, 3.5, 3.0);

      const centerCommuIcon = 
      new THREE.Vector3(foundation.get('positionX') - externalPortsExtension.x * 6.0,
        foundation.get('positionY') - foundation.get('extension').y + externalPortsExtension.y,
        foundation.get('positionZ') + foundation.get('extension').z * 2.0 - 
        externalPortsExtension.z);

      layoutInAndOutCommunication(commu, commu.get('targetClazz'), centerCommuIcon);
    }

    function layoutOutgoingCommunication(commu, foundation) {

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
