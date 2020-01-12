import GlimmerComponent from "@glimmer/component";
import Component from "explorviz-frontend/models/component";

interface Args {
  component: Component
}

export default class ComponentPopup extends GlimmerComponent<Args> {

  get name() {
    return this.args.component.get('name');
  }

  get clazzCount() {
    return this._getClazzesCount(this.args.component);
  }

  get packageCount() {
    return this._getPackagesCount(this.args.component);
  }

  _getClazzesCount(component:Component) : number {
    let result = component.get('clazzes').get('length');
    const children = component.get('children');
    children.forEach((child) => {
      result += this._getClazzesCount(child);
    });
    return result;
  }

  _getPackagesCount(component:Component) : number {
    let result = component.get('children').get('length');
    const children = component.get('children');
    children.forEach((child) => {
      result += this._getPackagesCount(child);
    });
    return result;
  }
}