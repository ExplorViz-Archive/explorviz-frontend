import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from "@ember/service";
import DS from 'ember-data';
import RenderingService from 'explorviz-frontend/services/rendering-service';
import { action } from '@ember/object';

export default class ApplicationOpener extends Component {

  // Saves the state whether 'openAllComponents' was clicked and the packages are opened or not
  @tracked
  openedActive: boolean = false;

  @service('store') store!: DS.Store;
  @service('rendering-service') renderingService!: RenderingService;

  @action
  openAllComponents() {
    const allClazzes = this.store.peekAll('clazz');

    allClazzes.forEach(function (clazz) {
      clazz.openParents();
    });

    this.openedActive = true;
    this.renderingService.redrawScene();
  }

  @action
  closeAllComponents() {
    const allClazzes = this.store.peekAll('clazz');

    allClazzes.forEach(function (clazz) {
      clazz.closeParents();
    });

    this.openedActive = false;
    this.renderingService.redrawScene();
  }

}