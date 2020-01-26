import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import RenderingService from 'explorviz-frontend/services/rendering-service';

export default class ResetVisualization extends Component {
  @service('rendering-service') renderingService!: RenderingService;

  @action
  resetView() {
    this.renderingService.reSetupScene();
  }
}
