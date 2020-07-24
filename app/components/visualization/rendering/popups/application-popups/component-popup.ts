import GlimmerComponent from '@glimmer/component';
import Component from 'explorviz-frontend/models/component';

interface Args {
  component: Component
}

export default class ComponentPopup extends GlimmerComponent<Args> {
  get name() {
    return this.args.component.get('name');
  }

  get clazzCount() {
    return this.getClazzesCount(this.args.component);
  }

  get packageCount() {
    return this.getPackagesCount(this.args.component);
  }

  getClazzesCount(component: Component): number {
    let result = component.get('clazzes').get('length');
    const children = component.get('children');
    children.forEach((child) => {
      result += this.getClazzesCount(child);
    });
    return result;
  }

  getPackagesCount(component: Component): number {
    let result = component.get('children').get('length');
    const children = component.get('children');
    children.forEach((child) => {
      result += this.getPackagesCount(child);
    });
    return result;
  }
}
