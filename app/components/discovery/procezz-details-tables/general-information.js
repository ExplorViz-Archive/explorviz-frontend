import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Component.extend({

  // No Ember generated container
  tagName: '',

  toggleStateWebServer: alias('procezz.webserverFlag'),
  toggleIsHidden: alias('procezz.isHidden'),  

  lastDiscoveryTimeAsDate: computed('procezz.lastDiscoveryTime', function() {
    const lastDiscoveryTime = this.get('procezz.lastDiscoveryTime');
    return new Date(lastDiscoveryTime).toLocaleString();
  })

});