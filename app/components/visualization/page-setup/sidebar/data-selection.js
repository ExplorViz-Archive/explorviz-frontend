import Component from '@ember/component';
import { inject as service } from "@ember/service";

import $ from 'jquery';

export default Component.extend({
  // No Ember generated container
  tagName: '',

  additionalData: service('additional-data'),

  actions: {
    closeWindow() {
      this.get('additionalData').emptyAndClose();
    },

    openWindow() {
      this.get('additionalData').openAdditionalData();
    },
  },

  closeDataSelection() {
    $('#dataselection').addClass('hide');
    $('#vizspace').addClass('col-12');
    $('#vizspace').removeClass('col-8');
  },

  openDataSelection() {
    $('#dataselection').removeClass('hide');
    $('#vizspace').addClass('col-8');
    $('#vizspace').removeClass('col-12');
  },

  onShowWindow() {
    if(this.get('additionalData.showWindow'))
      this.openDataSelection();
    else
      this.closeDataSelection();
  },

  init() {
    this._super(...arguments);
    this.get('additionalData').on('showWindow', this, this.onShowWindow);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.get('additionalData').off('showWindow', this, this.onShowWindow);
  }
});
