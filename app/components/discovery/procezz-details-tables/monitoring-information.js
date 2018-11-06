import Component from '@ember/component';
import { alias } from '@ember/object/computed';

export default Component.extend({

  // No Ember generated container
  tagName: '',

  toggleStateMonitoring: alias('procezz.monitoredFlag')

});