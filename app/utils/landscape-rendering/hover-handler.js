import Ember from 'ember';

export default Ember.Object.extend(Ember.Evented, {

  alreadyDestroyed: true,


  showTooltip(mouse, emberModel) {

    let content = this.buildContent(emberModel);

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


    return content;



    // Helper functions
    
    function buildApplicationContent(emberModel) {

      let content = {title: '', html: ''};

      content.title = emberModel.get('name');

      const year = new Date(emberModel.get('lastUsage')).toLocaleString();

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
              emberModel.get('programmingLanguage') + 
            '</td>' +
          '</tr>' + 
        '</table>';

      return content;
    }


  } // END buildApplicationContent

});