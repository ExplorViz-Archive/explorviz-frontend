import Ember from 'ember';

import ApplicationRouteMixin from 
'ember-simple-auth/mixins/application-route-mixin';

const { Route, $ } = Ember;

export default Route.extend(ApplicationRouteMixin, {

  actions: {
    logout: function() {
      this.get('session').invalidate();
    },
    toggleTimeline() {

      if($(".timeline").attr('vis') ==='show') {

        $(".timeline").slideUp();
        $(".viz").animate({height:'+=200'});
        $(".timeline").attr('vis','hide');

      } else {

        $(".timeline").slideDown();
        $(".viz").animate({height:'-=200'});
        $(".timeline").attr('vis','show');

      }
    }
  }
});