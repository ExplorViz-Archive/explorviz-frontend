import Component from '@ember/component';
import $ from 'jquery';
import { inject as service } from '@ember/service';

export default Component.extend({

  additionalData: service(),

  didRender() {
    this._super(...arguments);

    if (this.get('additionalData.popupContent')) {
      this.setPopupPosition();
    }
  },

  setPopupPosition() {
    let popupData = this.get('additionalData.popupContent');

    const popoverDiv = $('.popover');

    // Sorrounding div for position calculations
    const containerDiv = $('#rendering');

    const popupTopOffset = popoverDiv.height() + 10;
    const popupLeftOffset = popoverDiv.width() / 2;

    let popupTopPosition = popupData.mouseY - popupTopOffset;
    let popupLeftPosition = popupData.mouseX - popupLeftOffset;

    // Prevent popup positioning on top of rendering canvas => 
    // position under mouse cursor
     if (popupTopPosition < 0) {
      popupTopPosition = popupData.mouseY + 35;
    }

    // Prevent popup positioning right(outside) of rendering canvas => 
    // position at right edge of canvas
    if (popupLeftPosition + popoverDiv.width() > containerDiv.width()) {
      popupLeftPosition = containerDiv.width() - popoverDiv.width() - 5;
    }

    // Prevent popup positioning left(outside) of rendering canvas => 
    // position at left edge of canvas
    if (popupLeftPosition < 0) {
      popupLeftPosition = 0;
    }

    // Set popup position
    $('.popover').css('top', popupTopPosition + 'px');
    $('.popover').css('left', popupLeftPosition + 'px');
  }
})