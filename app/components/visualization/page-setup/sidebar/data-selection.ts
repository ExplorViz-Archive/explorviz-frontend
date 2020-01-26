import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import AdditionalData from 'explorviz-frontend/services/additional-data';
import $ from 'jquery';

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
    if (this.additionalData.showWindow) {
      this.openDataSelection();
    } else {
      this.closeDataSelection();
    }
  }
}
