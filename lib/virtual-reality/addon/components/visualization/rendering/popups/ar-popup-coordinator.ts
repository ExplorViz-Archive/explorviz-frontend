import Component from '@glimmer/component';
import { isDrawableClassCommunication } from 'explorviz-frontend/utils/application-rendering/class-communication-computer';
import {
  Application, Class, isApplication, isClass, isNode, isPackage, Node, Package,
} from 'explorviz-frontend/utils/landscape-schemes/structure-data';

interface Args {
  popupData: {
    mouseX: number,
    mouseY: number,
    entity: Node | Application | Package | Class
  };
}

export default class ArPopupCoordinator extends Component<Args> {
  get entityType() {
    if (isNode(this.args.popupData.entity)) {
      return 'node';
    }
    if (isApplication(this.args.popupData.entity)) {
      return 'application';
    }
    if (isClass(this.args.popupData.entity)) {
      return 'class';
    }
    if (isPackage(this.args.popupData.entity)) {
      return 'package';
    }
    if (isDrawableClassCommunication(this.args.popupData.entity)) {
      return 'drawableClassCommunication';
    }

    return '';
  }
}
