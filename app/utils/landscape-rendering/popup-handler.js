import Ember from 'ember';
import { encodeStringForPopUp } from '../helpers/string-helpers';

export default Ember.Object.extend(Ember.Evented, {

  alreadyDestroyed: true,

  enableTooltips: true,


  showTooltip(mouse, emberModel) {

    if(!this.get('enableTooltips')) {
      return;
    }

    let content = this.buildContent(emberModel);

    if(content.title === '' && content.html === '') {
      return;
    }

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

    if(modelType === 'application') {
      content = buildApplicationContent(emberModel);
    }
    else if(modelType === 'system') {
      content = buildSystemContent(emberModel);
    }
    else if(modelType === 'node') {
      content = buildNodeContent(emberModel);
    }
    else if(modelType === 'nodegroup') {
      content = buildNodegroupContent(emberModel);
    }
    else if(modelType === 'communication') {
      content = buildCommunicationContent(emberModel);
    }

    return content;



    // Helper functions

    function buildApplicationContent(application) {

      let content = {title: '', html: ''};

      content.title = encodeStringForPopUp(application.get('name'));

      const year = new Date(application.get('lastUsage')).toLocaleString();

      content.html =
        '<table style="width:100%">' +
          '<tr>' +
            '<td>Last Usage:</td>' +
            '<td style="text-align:right;padding-left:10px;">' +
              year +
            '</td>' +
          '</tr>' +
          '<tr>' +
            '<td>Language:</td>' +
            '<td style="text-align:right;padding-left:10px;">' +
              application.get('programmingLanguage') +
            '</td>' +
          '</tr>' +
        '</table>';

      return content;
    }


    function buildSystemContent(system) {

      let content = {title: '', html: ''};

      content.title = encodeStringForPopUp(system.get('name'));

      var nodesCount = 0;
      var applicationCount = 0;

      // Calculate node and application count
      const nodeGroups = system.get('nodegroups');

      nodeGroups.forEach((nodeGroup) => {

        nodesCount += nodeGroup.get('nodes').get('length');

        const nodes = nodeGroup.get('nodes');

        nodes.forEach((node) => {
          applicationCount += node.get('applications').get('length');
        });

      });


      content.html =
        '<table style="width:100%">' +
          '<tr>' +
            '<td>Nodes:</td>' +
            '<td style="text-align:right;padding-left:10px;">' +
              nodesCount +
            '</td>' +
          '</tr>' +
          '<tr>' +
            '<td>Applications:</td>' +
            '<td style="text-align:right;padding-left:10px;">' +
              applicationCount +
            '</td>' +
          '</tr>' +
        '</table>';

      return content;
    }

    function round(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }

    function buildNodeContent(node) {

      let content = {title: '', html: ''};

      content.title = node.getDisplayName();

      // Formatted values for the node popup
      const formatFactor = (1024 * 1024 * 1024);
      var cpuUtilization = round(node.get('cpuUtilization') * 100, 0);
      var freeRAM =  round(node.get('freeRAM') / formatFactor, 2).toFixed(2);
      var totalRAM =  round((node.get('usedRAM') + node.get('freeRAM')) / formatFactor, 2).toFixed(2);

      content.html =
        '<table style="width:100%">' +
          '<tr>' +
            '<td>CPU Utilization:</td>' +
            '<td style="text-align:right;padding-left:10px;">' +
              cpuUtilization + ' %' +
            '</td>' +
          '</tr>' +
          '<tr>' +
            '<td>Free RAM:</td>' +
            '<td style="text-align:right;padding-left:10px;">' +
            freeRAM + ' GB' +
            '</td>' +
          '</tr>' +
          '<tr>' +
            '<td>Total RAM:</td>' +
              '<td style="text-align:right;padding-left:10px;">' +
              totalRAM + ' GB' +
            '</td>' +
          '</tr>' +
        '</table>';

      return content;
    }


    function buildNodegroupContent(nodeGroup) {

      let content = {title: '', html: ''};

      content.title = encodeStringForPopUp(nodeGroup.get('name'));

      var avgNodeCPUUtil = 0.0;
      var applicationCount = 0;

      // Calculate node and application count
      const nodes = nodeGroup.get('nodes');

      nodes.forEach((node) => {

        avgNodeCPUUtil += node.get('cpuUtilization');

        applicationCount += node.get('applications').get('length');

      });


      content.html =
        '<table style="width:100%">' +
          '<tr>' +
            '<td>Nodes:</td>' +
            '<td style="text-align:right;padding-left:10px;">' +
              nodes.get('length') +
            '</td>' +
          '</tr>' +
          '<tr>' +
            '<td>Applications:</td>' +
            '<td style="text-align:right;padding-left:10px;">' +
              applicationCount +
            '</td>' +
          '</tr>' +
          '<tr>' +
            '<td>Avg. CPU Utilization:</td>' +
            '<td style="text-align:right;padding-left:10px;">' +
              avgNodeCPUUtil +
            '</td>' +
          '</tr>' +
        '</table>';

      return content;
    }



    function buildCommunicationContent(communication) {

      let content = {title: '', html: ''};

      content.title = encodeStringForPopUp(communication.get('source').get('name')) +
        "&nbsp;<span class='glyphicon glyphicon-transfer'></span>&nbsp;";

      content.html =
        '<table style="width:100%">' +
          '<tr>' +
            '<td>Requests:</td>' +
            '<td style="text-align:right;padding-left:10px;">' +
              communication.get('requests') +
            '</td>' +
          '</tr>' +
          '<tr>' +
            '<td>Technology:</td>' +
            '<td style="text-align:right;padding-left:10px;">' +
              communication.get('technology') +
            '</td>' +
          '</tr>' +
          '<tr>' +
            '<td>Avg. Duration:</td>' +
            '<td style="text-align:right;padding-left:10px;">' +
              communication.get('averageResponseTimeInNanoSec') + ' ms' +
            '</td>' +
          '</tr>' +
        '</table>';

      return content;
    }




  } // END buildApplicationContent

});
