import Component from '@ember/component';
import $ from 'jquery';
import {inject as service} from '@ember/service';

export default Component.extend({

    additionalData: service(),

    didRender(){
        this._super(...arguments);

        if (this.get('additionalData.popupContent')){
            let popupData = this.get('additionalData.popupContent');

            const popoverDiv = $('.popover');
        
            const topOffset = popoverDiv.height() + 10;
            const leftOffset = popoverDiv.width() / 2;
            
            $('.popover').css('top', popupData.mouseY - topOffset + 'px');
            $('.popover').css('left', popupData.mouseX - leftOffset + 'px');
        }
    }
})