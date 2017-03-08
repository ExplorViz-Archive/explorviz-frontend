import Ember from 'ember';

export default Ember.Service.extend({

  applyLayout(application) {

    const insetSpace = 4.0;

    const components = application.get('components');
    
    const foundationComponent = components.objectAt(0);

    calcClazzHeight(foundationComponent);
    initNodes(foundationComponent);

    doLayout(foundationComponent);
/*  setAbsoluteLayoutPosition(foundationComponent);

    layoutEdges(application);

    const incomingCommunications = application.get('incomingCommunications');
    incomingCommunications.forEach((commu) => {
      layoutIncomingCommunication(commu, application.components.get(0));
    });

    const outgoingCommunications = application.get('outgoingCommunications');
    outgoingCommunications.forEach((commu) => {
      layoutOutgoingCommunication(commu, application.components.get(0));
    });*/




    // Helper functions

    function calcClazzHeight(component) {

      const clazzSizeDefault = 0.05;
      const clazzSizeEachStep = 1.1;

      const clazzes = [];
      getClazzList(component, clazzes);

      const instanceCountList = [];

      clazzes.forEach((clazz) => {
        instanceCountList.push(clazz.get('instanceCount'));
      });

      //val categories = MathHelpers::getCategoriesForClazzes(instanceCountList)

      clazzes.forEach((clazz) => {
        //clazz.height = (clazzSizeEachStep * categories.get(clazz.instanceCount) + clazzSizeDefault) * 4.0
        clazz.set('height', (clazzSizeEachStep * 3.0 + clazzSizeDefault) * 4.0);
      });
    }


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
        clazz.set('height', clazzWidth);
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

        children.forEach((child) => {
          if (child.get('height') > childrenHeight) {
            childrenHeight = child.get('height');
          }
        });

        clazzes.forEach((clazz) => {
          if (clazz.get('height') > childrenHeight) {
            childrenHeight = clazz.get('height');
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

      //addLabelInsetSpace(rootSegment, children);

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



  } // END applyLayout

});
