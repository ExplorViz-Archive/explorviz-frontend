import $ from 'jquery';

declare const alertify: any;

/**
* TODO
*
* @class AlertifyHandler
*
* @module explorviz
*/
export default class AlertifyHandler {

  static alertActive = false;

  static showAlertifyError(message:string) {
    this.showAlertifyMessageWithDuration(message, 5, 'error');
  }

  static showAlertifyWarning(message:string) {
    this.showAlertifyMessageWithDuration(message, 3, 'warning');
  }

  static showAlertifySuccess(message:string) {
    this.showAlertifyMessageWithDuration(message, 3, 'success');
  }

  static showAlertifyMessage(message:string) {
    this.showAlertifyMessageWithDuration(message, 3);
  }

  static showAlertifyMessageWithDuration(message:string, duration:number, cssClass:string='message') {

    this.alertActive = true;

    alertify.notify(message, cssClass, duration, () => {

      // if last dialog, set respective flag
      // This flag is not used atm, but may be used in the future
      if($('.ajs-message.ajs-message.ajs-visible').length === 0) {
        this.alertActive = false;
      }            
    });

  }

  static closeAlertifyMessages() {
    alertify.dismissAll();

    this.alertActive = false;
  }
}

alertify.set('notifier','position', 'bottom-right');
