import Ember from 'ember';

const { Component, $ } = Ember;

export default Component.extend({


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
