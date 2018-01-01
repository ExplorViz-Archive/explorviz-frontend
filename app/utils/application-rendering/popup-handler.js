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
    }


    function buildClazzContent(clazz) {

      let content = {title: '', html: ''};

      content.title = clazz.get('name');

      const calledMethods = getCalledMethods(clazz);
      
      content.html = 
        '<table style="width:100%">' + 
          '<tr>' + 
            '<td>Active Instances:</td>' + 
            '<td style="text-align:right;padding-left:10px;">' +
              clazz.get('instanceCount') + 
            '</td>' + 
          '</tr>' + 
          '<tr>' + 
            '<td>Called Methods:</td>' + 
            '<td style="text-align:right;padding-left:10px;">' +
              calledMethods + 
            '</td>' +
          '</tr>' + 
        '</table>';

      return content;


      function getCalledMethods(clazz) {
        console.log(clazz);
        //let methods = [];

        //console.log(clazz.get('parent.belongingApplication'));

        /*const communications = clazz.get('parent').get('belongingApplication').get('communications');

        communications.forEach((commu) => {
          if (commu.get('target') === clazz && commu.get('target') !== commu.get('source')) {
            console.log("asd");
            methods.push(commu.get('methodName'));
          }
        });

        return methods.length;*/

        return 0;

      }


    }


  } // END buildApplicationContent

});