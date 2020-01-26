import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import DS from 'ember-data';
import RenderingService from 'explorviz-frontend/services/rendering-service';

export default class ApplicationOpener extends Component {
  // saves the state whether 'openAllComponents' was clicked and the packages are opened or not
  @tracked
  openedActive: boolean = false;

  @service('store') store!: DS.Store;

  @service('rendering-service') renderingService!: RenderingService;

  @action
  openAllComponents() {
    const allClazzes = this.store.peekAll('clazz');

    allClazzes.forEach((clazz) => {
      clazz.openParents();
    });

    this.openedActive = true;
    this.renderingService.redrawScene();
  }

  @action
  closeAllComponents() {
    const allClazzes = this.store.peekAll('clazz');

    allClazzes.forEach((clazz) => {
      clazz.closeParents();
    });

    this.openedActive = false;
    this.renderingService.redrawScene();
  }
}
