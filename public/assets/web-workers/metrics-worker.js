// Wait for the initial message event.
self.addEventListener('message', function(e) {
    const structureData = e.data.structure;
    const dynamicData = e.data.dynamic;

    const metrics = calculateMetrics(structureData, dynamicData);

    postMessage(metrics);
  }, false);
    
  // Ping the Ember service to say that everything is ok.
  postMessage(true);
  
  
  /******* Define Metrics *******/
  
  function calculateMetrics(application, allLandscapeTraces) {  

    function calcInstanceCountMetric(application, allLandscapeTraces) {
      // Initialize matric components
      let min = 0;
      let max = 0;
      const values = new Map();
  
      getAllClazzesInApplication(application).forEach((clazz) => {
        values.set(clazz.id, 0);
      });

      const clazzes = [];
      application.packages.forEach((component) => {
        getClazzList(component, clazzes);
      });
  
      const hashCodeToClassMap = getHashCodeToClassMap(clazzes);
  
      const allMethodHashCodes = getAllSpanHashCodesFromTraces(allLandscapeTraces);
  
      for (let methodHashCode of allMethodHashCodes) {
        const classMatchingTraceHashCode = hashCodeToClassMap.get(methodHashCode);
  
        if(classMatchingTraceHashCode === undefined) {
          continue;
        }
  
        const methodMatchingSpanHash = classMatchingTraceHashCode.methods.find((method) => method.hashCode === methodHashCode);
  
        if(methodMatchingSpanHash === undefined) {
          continue;
        }

        // OpenCensus denotes constructor calls with <init>
        // Therefore, we count the <init>s for all given classes
        if (methodMatchingSpanHash.name === '<init>') {
          const newInstanceCount = values.get(classMatchingTraceHashCode.id) + 1;

          values.set(classMatchingTraceHashCode.id, newInstanceCount);
          max = Math.max(max, newInstanceCount);
        }
      }

      return {
        name: 'Instance Count',
        mode: 'aggregatedHeatmap',
        description: 'Number of newly created instances in given timeframe',
        min, 
        max, 
        values
      };
    }

    function calculateDummyMetric(application) {
      // Initialize matric components
      let min = Number.MAX_VALUE;
      let max = 0;
      const values = new Map();
  
      getAllClazzesInApplication(application).forEach((clazz) => {
        const randomValue = Math.random() * 1000;
        values.set(clazz.id, randomValue);
        min = Math.min(min, randomValue);
        max = Math.max(max, randomValue);
      });

      if (min > max) {
        min = 0;
      } 

      return {
        name: 'Dummy Metric',
        mode: 'aggregatedHeatmap',
        description: 'Random values between 0 and 1000',
        min, 
        max, 
        values
      };
    }


    let metrics = [];

    const dummyMetric = calculateDummyMetric(application);
    metrics.push(dummyMetric);

    const instanceCountMetric = calcInstanceCountMetric(application, allLandscapeTraces);
    metrics.push(instanceCountMetric);

    return metrics;
  
    // Helper functions

    function getAllClazzesInApplication(application) {
      let allComponents = getAllComponentsInApplication(application);
  
      let allClazzes = [];
      allComponents.forEach(component => {
        allClazzes.push(...component.classes);
      });
      return allClazzes;
    }

    function getClazzList(component, clazzesArray) {
      const children = component.subPackages;
      const clazzes = component.classes;
  
      children.forEach((child) => {
        getClazzList(child, clazzesArray);
      });
  
      clazzes.forEach((clazz) => {
        clazzesArray.push(clazz);
      });
    }
  
    function getAllComponentsInApplication(application) {
      let children = application.packages;
  
      let components = [];
  
      children.forEach((component) => {
        components.push(...getAllComponents(component), component);
      });
      return components;
    }
  
    function getAllComponents(component) {
      let components = [];
      component.subPackages.forEach((component) => {
        components.push(...getAllComponents(component), component);
      });
  
      return components;
    }
  
    function getHashCodeToClassMap(clazzes) {
      const hashCodeToClassMap = new Map();    
    
      clazzes.forEach((clazz) => {
        clazz.methods.forEach(({ hashCode }) => hashCodeToClassMap.set(hashCode, clazz));
      });
    
      return hashCodeToClassMap;
    }
  
    function getAllSpanHashCodesFromTraces(traceArray) {
      const hashCodes = [];
      
      traceArray.forEach((trace) => {
        trace.spanList.forEach((span) => {
          hashCodes.push(span.hashCode);
        });
      });
      return hashCodes;
    }  
  }
  