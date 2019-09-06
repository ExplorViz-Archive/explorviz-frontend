import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { action } from '@ember/object';
import RenderingService from 'explorviz-frontend/services/rendering-service';

export default class ResetVisualization extends Component {

  // No Ember generated container
  tagName = '';

  @service('rendering-service') renderingService!: RenderingService;

  @action
  resetView() {
    this.renderingService.reSetupScene();
  }

}
