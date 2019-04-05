import Mixin from '@ember/object/mixin';
import $ from 'jquery';

/* global alertify */

/**
* TODO
*
* @class Alertify-Handler
* @extends Ember.Mixin
*
* @module explorviz
* @submodule page
*/
export default Mixin.create({

  // @Override
  init() {
    this._super(...arguments);
    this.set('alertActive', false);
    alertify.set('notifier','position', 'bottom-left');
  },

  showAlertifyError(message) {
    this.showAlertifyMessageWithDuration(message, 3, "error");
  },

  showAlertifyWarning(message) {
    this.showAlertifyMessageWithDuration(message, 3, "warning");
  },

  showAlertifySuccess(message) {
    this.showAlertifyMessageWithDuration(message, 3, "success");
  },

  showAlertifyMessage(message) {
    this.showAlertifyMessageWithDuration(message, 3);
  },

  showAlertifyMessageWithDuration(message, duration, cssClass) {

    if(!cssClass) {
      cssClass = "message";
    }

    const self = this;

    this.set('alertActive', true);

    alertify.notify(message, cssClass, duration, function(){

      // if last dialog, set respective flag
      // This flag is not used atm, but may be used in the future
      if($('.ajs-message.ajs-message.ajs-visible').length === 0) {

        // reference might be destroyed 
        // since outer container (e.g. component) might be destroyed
        if(self && !self.isDestroyed) {
          self.set('alertActive', false);
        }  
      }            
    });

  },

  closeAlertifyMessages() {
    alertify.dismissAll();

    // reference might be destroyed 
    // since outer container (e.g. component) might be destroyed
    if(this && !this.isDestroyed) {
      this.set('alertActive', false);
    }  
  }

});
