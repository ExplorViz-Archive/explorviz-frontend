import Component from '@ember/component';
import $ from 'jquery';
import {inject as service} from '@ember/service';

export default Component.extend({

    additionalData: service(),

    didRender(){
        this._super(...arguments);

        if (this.get('additionalData.popupContent')){
            this.setPopupPosition();
        }
    },

    setPopupPosition(){
        let popupData = this.get('additionalData.popupContent');

        const popoverDiv = $('.popover');
        const containerDiv = $('.main-content');

        const containerTopOffset = containerDiv.offset().top;
        const containerLeftOffset = containerDiv.offset().left;
    
        const popupTopOffset = popoverDiv.height();
        const popupLeftOffset = popoverDiv.width() / 2;

        const popupTopPosition = containerTopOffset + popupData.mouseY - popupTopOffset;
        const popupLeftPosition = containerLeftOffset + popupData.mouseX - popupLeftOffset;

        $('.popover').css('top', popupTopPosition + 'px');
        $('.popover').css('left', popupLeftPosition + 'px');
    }
})