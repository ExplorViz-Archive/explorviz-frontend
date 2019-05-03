import Component from '@ember/component';
import { inject as service } from "@ember/service";
import DS from 'ember-data';
import RenderingService from 'explorviz-frontend/services/rendering-service';
import { action } from '@ember/object';


export default class ApplicationOpener extends Component {

  // No Ember generated container
  tagName = '';

  @service('store') store!: DS.Store;

  @service('rendering-service') renderingService!: RenderingService;

  @action
  openAllComponents() {
    const allClazzes = this.get('store').peekAll('clazz');

    allClazzes.forEach(function (clazz) {
      clazz.openParents();
    });
    this.get('renderingService').redrawScene();
  }

}
