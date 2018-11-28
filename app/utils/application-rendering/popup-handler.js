import Object from '@ember/object';
import Evented from '@ember/object/evented';
import { inject as service } from '@ember/service';

export default Object.extend(Evented, {

  additionalData: service("additional-data"),

  alreadyDestroyed: true,

  showTooltip(mouse, emberModel) {
    let popupData;
    let modelType = emberModel.constructor.modelName;

    if (modelType == "cumulatedclazzcommunication") {
      popupData = this.buildCommunicationData(mouse, emberModel);
    }

    this.get("additionalData").setPopupContent(popupData);
  },

  buildCommunicationData(mouse, cumulatedClazzCommunication) {
    let runtimeStats = getRuntimeInformations(cumulatedClazzCommunication);

    // TODO: check if this is correct way to check for bidirectionality
    const isBidirectional = cumulatedClazzCommunication.get("aggregatedClazzCommunications").get("length") > 1;

    // Formatted values for the clazzCommunication popup
    const formatFactor = 1000; // convert from ns to ms
    const avgAverageResponseTime = round(runtimeStats.avgAverageResponseTime / formatFactor, 0);
    const avgOverallTraceDuration = round(runtimeStats.avgOverallTraceDuration / formatFactor, 0);

    let popupData = {
      isShown: true,
      popupType: "communication",
      top: mouse.y - 175, // incorporate popup height
      left: mouse.x - 138, // incorporate popup width / 2
      sourceClazz: cumulatedClazzCommunication.get("sourceClazz").get("name"),
      targetClazz: cumulatedClazzCommunication.get("targetClazz").get("name"),
      isBidirectional: isBidirectional,
      requests: cumulatedClazzCommunication.get("requests"),
      traces: runtimeStats.involvedTraces.length,
      responseTime: avgAverageResponseTime,
      duration: avgOverallTraceDuration,
    }

    return popupData;

    // retrieves runtime information for a specific aggregatedClazzCommunication (same sourceClazz and tagetClazz)
    function getRuntimeInformations(cumulatedClazzCommunication) {

      let runtimeStats = {
        // sum up
        totalOverallTraceDuration: 0,
        totalAverageResponseTime: 0,

        // interesting for popups
        involvedTraces: [],
        avgOverallTraceDuration: 0,
        avgAverageResponseTime: 0
      };

      let runtimeInformationCounter = 0;

      let runtimeInformations = cumulatedClazzCommunication.getRuntimeInformations();

      // accumulate runtime information
      runtimeInformations.forEach((runtimeInformation) => {
        runtimeStats.involvedTraces.push(runtimeInformation.get("traceId"));
        runtimeStats.totalOverallTraceDuration += runtimeInformation.get("overallTraceDuration");
        runtimeStats.totalAverageResponseTime += runtimeInformation.get("averageResponseTime");

        runtimeInformationCounter++;
      });

      // calculate averages
      if (runtimeInformationCounter > 0) {
        runtimeStats.avgAverageResponseTime = runtimeStats.totalAverageResponseTime / runtimeInformationCounter;
        runtimeStats.avgOverallTraceDuration = runtimeStats.totalOverallTraceDuration / runtimeInformationCounter;
      }

      return runtimeStats;

    } // END getRuntimeInformations

    function round(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    } // END round
  },


  hideTooltip() {
    this.get("additionalData").removePopup();
  },

});
