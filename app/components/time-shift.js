import Ember from 'ember';

const { Component, $, on, observer } = Ember;

export default Component.extend({

  plot : null,

  init() {
    this._super(...arguments);

    $(window).resize(() => {
      this.resizePlot();
    });

  },

  renderPlot: on('didRender', observer('', function () {

    var winWidth = $(window).width();

    Ember.$("#timeline").css('width', winWidth); 

    // flot setup
    var d1 = [];

    for (var i = 0; i < 14; i += 0.5) {
      d1.push([i, Math.sin(i)]);
    }

    var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

    // A null signifies separate line segments
    var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];

    const plot = $.plot("#timeline", [ d1, d2, d3 ]);
    this.set('plot', plot);
  })),

  resizePlot: function() {
    this.renderPlot();
  },


  actions: {

    toggleTimeline() {

     if($(".timeline").attr('vis') ==='show') {

       $(".timeline").slideUp();
       $("#vizContainer").animate({height:'+=200'});
       $(".timeline").attr('vis','hide');

     } 
     else {

       $(".timeline").slideDown();
       $("#vizContainer").animate({height:'-=200'});
       $(".timeline").attr('vis','show');

     }
   }
 }

});
