import Component from '@ember/component';
import { inject as service } from "@ember/service";
import DS from 'ember-data';
import RenderingService from 'explorviz-frontend/services/rendering-service';
import { action, set } from '@ember/object';

export default class ApplicationOpener extends Component {

  // No Ember generated container
  tagName = '';

  // saves the state whether 'openAllComponents' was clicked and the packages are opened or not
  openedActive: boolean = false;

  @service('store') store!: DS.Store;

  @service('rendering-service') renderingService!: RenderingService;

  @action
  openAllComponents() {
    const allClazzes = this.store.peekAll('clazz');

    allClazzes.forEach(function (clazz) {
      clazz.openParents();
    });

    set(this, 'openedActive', true);
    this.renderingService.redrawScene();
  }

  @action
  closeAllComponents() {
    const allClazzes = this.store.peekAll('clazz');

    allClazzes.forEach(function (clazz) {
      clazz.closeParents();
    });

    set(this, 'openedActive', false);
    this.renderingService.redrawScene();
  }

}
