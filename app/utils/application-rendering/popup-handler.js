import Ember from 'ember';
import { encodeStringForPopUp } from '../helpers/string-helpers';

export default Ember.Object.extend(Ember.Evented, {

  alreadyDestroyed: true,


  showTooltip(mouse, emberModel) {

    let content = this.buildContent(emberModel);

    if(content.title === '' && content.html === '') {
      return;
    }

    // Bootstrap Popover
    Ember.$('#vizContainer').popover(
      {
        title: '<div style="font-weight:bold;text-align:center;">' +
          content.title + '</div>',
        content : content.html,
        placement:'top',
        trigger:'manual',
        html:true
      }
    );

    Ember.$('#vizContainer').popover('show');

    const topOffset = Ember.$('.popover').height() + 7;
    const leftOffset = Ember.$('.popover').width() / 2;

    Ember.$('.popover').css('top', mouse.y - topOffset + 'px');
    Ember.$('.popover').css('left', mouse.x - leftOffset + 'px');

    this.set('alreadyDestroyed', false);

  },


  hideTooltip() {

    if(!this.get('alreadyDestroyed')) {
      Ember.$('#vizContainer').popover('destroy');
      this.set('alreadyDestroyed', true);
    }
  },


  buildContent(emberModel) {
    let content = {title: '', html: ''};

    const modelType = emberModel.constructor.modelName;

    if(modelType === 'component') {
      content = buildComponentContent(emberModel);
    }
    else if(modelType === 'clazz') {
      content = buildClazzContent(emberModel);
    }
    else if(modelType === 'clazzcommunication') {
      content = buildClazzCommunicationContent(emberModel);
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

    function buildClazzCommunicationContent(clazzcommunication) {

      let content = {title: '', html: ''};

      const sourceClazzName = clazzcommunication.get('sourceClazz').get('name');
      const targetClazzName = clazzcommunication.get('targetClazz').get('name');

      const aggregatedRuntimeInformation = getRuntimeInformations(clazzcommunication);

      content.title = encodeStringForPopUp(sourceClazzName) +
        "&nbsp;<span class='glyphicon glyphicon-arrow-right'></span>&nbsp;" + encodeStringForPopUp(targetClazzName);

      content.html =
        '<table style="width:100%">' +
        '<tr>' +
        '<td>&nbsp;<span class=\'glyphicon glyphicon-tasks\'></span>&nbsp;  Requests:</td>' +
        '<td style="text-align:right;padding-left:10px;">' +
        aggregatedRuntimeInformation.totalRequests +
        '</td>' +
        '</tr>' +
        //'<tr>' +
        //'<td>Called Times:</td>' +
        //'<td style="text-align:right;padding-left:10px;">' +
        //aggregatedRuntimeInformation.totalCalledTimes +
        //'</td>' +
        //'</tr>' +
        '<tr>' +
        '<td>&nbsp;<span class=\'glyphicon glyphicon-time\'></span>&nbsp; Avg. Response Time:</td>' +
        '<td style="text-align:right;padding-left:10px;">' +
        aggregatedRuntimeInformation.avgAverageResponseTime + ' ns' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>&nbsp;<span class=\'glyphicon glyphicon-time\'></span>&nbsp; Avg. Duration:</td>' +
        '<td style="text-align:right;padding-left:10px;">' +
        aggregatedRuntimeInformation.avgOverallTraceDuration + ' ns' +
        '</td>' +
        '</tr>' +
        '</table>';

      return content;

      // retrieves all runtimeinformations for a specific clazzCommunication
      function getRuntimeInformations(clazzcommunication) {
        const runtimeInformations = clazzcommunication.get('runtimeInformations');

        let aggregatedRuntimeInformation = {
          // sum up
          totalOverallTraceDuration: 0,
          totalAverageResponseTime: 0,

          // interessting for popups
          totalRequests: 0,
          totalCalledTimes: 0,
          avgOverallTraceDuration: 0,
          avgAverageResponseTime: 0
        };

        var runtimeInformationCounter = 0;

        runtimeInformations.forEach((runtimeInformation) => {
          aggregatedRuntimeInformation.totalRequests += runtimeInformation.get('requests');
          aggregatedRuntimeInformation.totalCalledTimes += runtimeInformation.get('calledTimes');
          aggregatedRuntimeInformation.totalOverallTraceDuration += runtimeInformation.get('overallTraceDuration');
          aggregatedRuntimeInformation.totalAverageResponseTime += runtimeInformation.get('averageResponseTime');
          runtimeInformationCounter++;
        });

        if (runtimeInformationCounter > 0) {
          aggregatedRuntimeInformation.avgAverageResponseTime = aggregatedRuntimeInformation.totalAverageResponseTime / runtimeInformationCounter;
          aggregatedRuntimeInformation.avgOverallTraceDuration = aggregatedRuntimeInformation.totalOverallTraceDuration / runtimeInformationCounter;
        }

        return aggregatedRuntimeInformation;

      } // END getRuntimeInformations

    } // END buildClazzCommunicationContent

  } // END buildApplicationContent

});
