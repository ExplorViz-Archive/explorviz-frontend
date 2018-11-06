import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Component.extend({

  // No Ember generated container
  tagName: '',

  toggleIsHidden: alias('agent.isHidden'),  

  lastDiscoveryTimeAsDate: computed('agent.lastDiscoveryTime', function() {
    const lastDiscoveryTime = this.get('agent.lastDiscoveryTime');
    return new Date(lastDiscoveryTime).toLocaleString();
  })

});