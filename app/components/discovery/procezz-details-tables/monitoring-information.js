import Component from '@ember/component';
import { alias } from '@ember/object/computed';

export default Component.extend({

  toggleStateMonitoring: alias('procezz.monitoredFlag')

});