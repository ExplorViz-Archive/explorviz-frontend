import Object from '@ember/object';
import Evented from '@ember/object/evented';
import { encodeStringForPopUp } from '../helpers/string-helpers';
import $ from 'jquery';

export default Object.extend(Evented, {

  alreadyDestroyed: true,

  showTooltip(mouse, emberModel) {

    let content = this.buildContent(emberModel);

    if(content.title === '' && content.html === '') {
      return;
    }

    const popoverDiv = $('<div class="popover bs-popover-top"></div>');

    //popoverDiv.append('<div class="arrow"></div>');
    popoverDiv.append(`<h3 class="popover-header"><div style="font-weight:bold;text-align:center;">${content.title}</div></h3>`);
    popoverDiv.append(`<div class="popover-body" style="white-space: nowrap;">${content.html}</div>`);

    $('#vizContainer').append(popoverDiv);

    const topOffset = popoverDiv.height() + 10;
    const leftOffset = popoverDiv.width() / 2;

    popoverDiv.css('top', mouse.y - topOffset + 'px');
    popoverDiv.css('left', mouse.x - leftOffset + 'px');

    // center arrow
    //$('.arrow').css('left', 20 + 'px');

    this.set('alreadyDestroyed', false);
  },


  hideTooltip() {

    if(!this.get('alreadyDestroyed')) {
      $('.popover').remove();
      this.set('alreadyDestroyed', true);
    }
  },


  buildContent: function (emberModel) {
    let content = {title: '', html: ''};

    const modelType = emberModel.constructor.modelName;

    if (modelType === 'component') {
      content = buildComponentContent(emberModel);
    }
    else if (modelType === 'clazz') {
      content = buildClazzContent(emberModel);
    }
    else if (modelType === 'cumulatedclazzcommunication') {
      content = buildCumulatedClazzCommunicationContent(emberModel);
    }

    return content;


    // Helper functions

    function buildComponentContent(component) {

      let content = {title: '', html: ''};

      content.title = encodeStringForPopUp(component.get('name'));

      const clazzesCount = getClazzesCount(component);
      const packageCount = getPackagesCount(component);

      content.html =
        '<table style="width:100%">' +
        '<tr>' +
        '<td>Contained Classes:</td>' +
        '<td style="text-align:right;padding-left:10px;">' +
        clazzesCount +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Contained Packages:</td>' +
        '<td style="text-align:right;padding-left:10px;">' +
        packageCount +
        '</td>' +
        '</tr>' +
        '</table>';

      function getClazzesCount(component) {
        let result = component.get('clazzes').get('length');

        const children = component.get('children');

        children.forEach((child) => {
          result += getClazzesCount(child);
        });

        return result;
      }

      function getPackagesCount(component) {
        let result = component.get('children').get('length');

        const children = component.get('children');

        children.forEach((child) => {
          result += getPackagesCount(child);
        });

        return result;
      }

      return content;
    } // END buildComponentContent


    function buildClazzContent(clazz) {

      let content = {title: '', html: ''};

      content.title = clazz.get('name');

      const calledOperations = getCalledOperations(clazz);

      content.html =
        '<table style="width:100%">' +
        '<tr>' +
        '<td>Active Instances:</td>' +
        '<td style="text-align:right;padding-left:10px;">' +
        clazz.get('instanceCount') +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Called Operations:</td>' +
        '<td style="text-align:right;padding-left:10px;">' +
        calledOperations +
        '</td>' +
        '</tr>' +
        '</table>';

      return content;

      function getCalledOperations(clazz) {
        const clazzCommunications = clazz.get('outgoingClazzCommunications');
        return clazzCommunications.get('length');
      }
    } // END buildClazzContent

    // Information about a clazzCommunication between two classes
    function buildCumulatedClazzCommunicationContent(cumulatedClazzCommunication) {

      let content = {title: '', html: ''};

      const sourceClazzName = cumulatedClazzCommunication.get('sourceClazz').get('name');
      const targetClazzName = cumulatedClazzCommunication.get('targetClazz').get('name');

      const numOfAggregatedClazzCommunications = cumulatedClazzCommunication.get('aggregatedClazzCommunications').get('length');

      const runtimeStats = getRuntimeInformations(cumulatedClazzCommunication);

      // Formatted values for the clazzCommunication popup
      const formatFactor = 1000; // convert from ns to ms
      const avgAverageResponseTime =  round(runtimeStats.avgAverageResponseTime / formatFactor, 0);
      const avgOverallTraceDuration =  round(runtimeStats.avgOverallTraceDuration / formatFactor, 0);


      /// determine the direction of communication symbol
      // default uni-directional
      let commDirectionString = "&nbsp;<span class='glyphicon glyphicon-arrow-right'></span>&nbsp;";
      // bi-directional communication
      if (numOfAggregatedClazzCommunications > 1) {
        commDirectionString = "&nbsp;<span class='glyphicon glyphicon-transfer'></span>&nbsp;";
      }

      content.title = encodeStringForPopUp(sourceClazzName) + commDirectionString + encodeStringForPopUp(targetClazzName);

      content.html =
        '<table style="width:100%">' +
        '<tr>' +
        '<td>&nbsp;<span class=\'glyphicon glyphicon-tasks\'></span>&nbsp; Requests:</td>' +
        '<td style="text-align:right;padding-left:10px;">' +
        cumulatedClazzCommunication.get('requests') +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>&nbsp;<span class=\'glyphicon glyphicon-triangle-right\'></span>&nbsp; Involved Traces :</td>' +
        '<td style="text-align:right;padding-left:10px;">' +
        runtimeStats.involvedTraces.length +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>&nbsp;<span class=\'glyphicon glyphicon-time\'></span>&nbsp; Avg. Response Time:</td>' +
        '<td style="text-align:right;padding-left:10px;">' +
        avgAverageResponseTime + ' ms' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>&nbsp;<span class=\'glyphicon glyphicon-time\'></span>&nbsp; Avg. Duration:</td>' +
        '<td style="text-align:right;padding-left:10px;">' +
        avgOverallTraceDuration + ' ms' +
        '</td>' +
        '</tr>' +
        '</table>';

      return content;

      // retrieves runtime information for a specific aggregatedClazzCommunication (same sourceClazz and tagetClazz)
      function getRuntimeInformations(cumulatedClazzCommunication) {

        const aggregatedClazzCommunications = cumulatedClazzCommunication.get('aggregatedClazzCommunications');

        let runtimeStats = {
          // sum up
          totalOverallTraceDuration: 0,
          totalAverageResponseTime: 0,

          // interesting for popups
          involvedTraces: [],
          avgOverallTraceDuration: 0,
          avgAverageResponseTime: 0
        };

        var runtimeInformationCounter = 0;

        aggregatedClazzCommunications.forEach((aggregatedClazzCommunication) => {

          const clazzCommunications = aggregatedClazzCommunication.get('outgoingClazzCommunications');

          // retrieves runtime information for every clazzCommunication (same sourceClazz, targetClazz, and operationName)
          clazzCommunications.forEach((clazzCommunication) => {
              const runtimeInformations = clazzCommunication.get('runtimeInformations');
              runtimeInformations.forEach((runtimeInformation) => {

                runtimeStats.involvedTraces.push(runtimeInformation.get('traceId'));
                runtimeStats.totalOverallTraceDuration += runtimeInformation.get('overallTraceDuration');
                runtimeStats.totalAverageResponseTime += runtimeInformation.get('averageResponseTime');

                runtimeInformationCounter++;
              });

          });
        });

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

    } // END buildClazzCommunicationContent

  } // END buildApplicationContent

});
