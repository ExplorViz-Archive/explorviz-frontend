import Component from '@ember/component';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import AdditionalData from 'explorviz-frontend/services/additional-data';

export default class PopupCoordinator extends Component {

  tagName = '';
  
  @service('additional-data')
  additionalData!: AdditionalData;

  didRender() {
    this._super(...arguments);

    if (this.get('additionalData').get('popupContent')) {
      this.setPopupPosition();
    }
  }

  setPopupPosition() {
    let popupData = this.get('additionalData').get('popupContent');

    const popoverDiv = $('.popover');

    // Sorrounding div for position calculations
    const containerDiv = $('#rendering');

    let popoverHeight = popoverDiv.height();
    let popoverWidth = popoverDiv.width();

    let containerWidth = containerDiv.width();

    if(popoverHeight === undefined || popoverWidth === undefined || containerWidth === undefined)
      return;

    const popupTopOffset = popoverHeight + 10;
    const popupLeftOffset = popoverWidth / 2;

    let popupTopPosition = popupData.mouseY - popupTopOffset;
    let popupLeftPosition = popupData.mouseX - popupLeftOffset;

    // Prevent popup positioning on top of rendering canvas => 
    // position under mouse cursor
    if (popupTopPosition < 0) {
      popupTopPosition = popupData.mouseY + 35;
    }

    // Prevent popup positioning right(outside) of rendering canvas => 
    // position at right edge of canvas
    if (popupLeftPosition + popoverWidth > containerWidth) {
      popupLeftPosition = containerWidth - popoverWidth - 5;
    }

    // Prevent popup positioning left(outside) of rendering canvas => 
    // position at left edge of canvas
    if (popupLeftPosition < 0) {
      popupLeftPosition = 0;
    }

    // Set popup position
    popoverDiv.css('top', popupTopPosition + 'px');
    popoverDiv.css('left', popupLeftPosition + 'px');
  }
}