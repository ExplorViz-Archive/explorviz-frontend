import Component from '@glimmer/component';
import { inject as service } from "@ember/service";
import { action } from '@ember/object';

import $ from 'jquery';
import AdditionalData from 'explorviz-frontend/services/additional-data';

export default class DataSelection extends Component {

  @service('additional-data') additionalData!: AdditionalData;

  @action
  closeWindow() {
    this.additionalData.emptyAndClose();
  }

  @action
  openWindow() {
    this.additionalData.openAdditionalData();
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

  @action
  onShowWindow() {
    if(this.additionalData.showWindow)
      this.openDataSelection();
    else
      this.closeDataSelection();
  }
}
