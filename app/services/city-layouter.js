import Ember from 'ember';

export default Ember.Service.extend({

  applyLayout(application) {

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
      tempList = tempList.concat(children, clazzes);

      const segment = layoutGeneric(tempList, component.get('opened'));

      console.log(segment);

      //component.set('width', segment.width);
      //component.set('depth', segment.height);
    }


    function layoutGeneric(children, openedComponent) {
      console.log(children);
      console.log(openedComponent);
      const rootSegment = createRootSegment(children);
      console.log(rootSegment);
/*
      let maxX = 0.0;
      let maxZ = 0.0;

      children.sortInplace(comp);

      for (child : children) {
        const childWidth = (child.width + insetSpace * 2);
        const childHeight = (child.depth + insetSpace * 2);
        child.positionY = 0.0;

        const foundSegment = rootSegment.insertFittingSegment(childWidth, childHeight);

        child.positionX = foundSegment.startX + insetSpace;
        child.positionZ = foundSegment.startZ + insetSpace;

        if (foundSegment.startX + childWidth > maxX) {
          maxX = foundSegment.startX + childWidth;
        }
        if (foundSegment.startZ + childHeight > maxZ) {
          maxZ = foundSegment.startZ + childHeight;
        }
      }

      rootSegment.width = maxX;
      rootSegment.height = maxZ;

      addLabelInsetSpace(rootSegment, children);

      return rootSegment;*/
    }

    function createRootSegment(children) {
      console.log(children);
      /*let worstCaseWidth = 0.0;
      let worstCaseHeight = 0.0;

      for (child : children) {
        worstCaseWidth = worstCaseWidth + (child.width + insetSpace * 2)
        worstCaseHeight = worstCaseHeight + (child.depth + insetSpace * 2)
      }

      val rootSegment = new LayoutSegment()
      rootSegment.startX = 0f
      rootSegment.startZ = 0f

      rootSegment.width = worstCaseWidth
      rootSegment.height = worstCaseHeight

      rootSegment*/
    }



  } // END applyLayout

});
