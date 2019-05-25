import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { action } from '@ember/object';

import $ from 'jquery';
import AdditionalData from 'explorviz-frontend/services/additional-data';

export default class DataSelection extends Component {
  // No Ember generated container
  tagName = '';

  @service('additional-data')
  additionalData!: AdditionalData;

  @action
  closeWindow() {
    this.get('additionalData').emptyAndClose();
  }

  @action
  openWindow() {
    this.get('additionalData').openAdditionalData();
  }

  closeDataSelection() {
    $('#dataselection').addClass('hide');
    $('#vizspace').addClass('col-12');
    $('#vizspace').removeClass('col-8');
  }

  openDataSelection() {
    $('#dataselection').removeClass('hide');
    $('#vizspace').addClass('col-8');
    $('#vizspace').removeClass('col-12');
  }

  onShowWindow() {
    if(this.get('additionalData').get('showWindow'))
      this.openDataSelection();
    else
      this.closeDataSelection();
  }

  init() {
    super.init();
    this.get('additionalData').on('showWindow', this, this.onShowWindow);
  }

  willDestroyElement() {
    super.willDestroyElement();
    this.get('additionalData').off('showWindow', this, this.onShowWindow);
  }
}
