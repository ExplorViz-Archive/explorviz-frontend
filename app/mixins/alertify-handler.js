import Ember from 'ember';

export default Ember.Mixin.create({

  // @Override
  init() {
    this._super(...arguments);
    this.set('alertActive', false);
    alertify.set('notifier','position', 'bottom-left');
  },

  showAlertifyMessage(message) {

    const self = this;

    this.set('alertActive', true);

    alertify.notify(message, 'message', 3, function(){

      // if last dialog, activate Popups again
      if(Ember.$('.ajs-message.ajs-message.ajs-visible').length === 0) {
        self.set('alertActive', false);
      }            
    });

  }

});
