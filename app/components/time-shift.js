import Ember from 'ember';

const { Component, $ } = Ember;

export default Component.extend({

   didRender() {
    this._super(...arguments);    
    console.log(this.$());
  },


  actions: {

    toggleTimeline() {

     if($(".timeline").attr('vis') ==='show') {

       $(".timeline").slideUp();
       $(".viz").animate({height:'+=200'});
       $(".timeline").attr('vis','hide');

     } 
     else {

       $(".timeline").slideDown();
       $(".viz").animate({height:'-=200'});
       $(".timeline").attr('vis','show');

     }
   }
 }

});
