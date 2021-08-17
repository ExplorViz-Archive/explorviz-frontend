import Component from '@glimmer/component';
import { RangeSetting as RangeSettingObject } from 'explorviz-frontend/services/user-settings';

interface Args {
  setting: RangeSettingObject;
  onChange(value: number): void;
}

export default class RangeSetting extends Component<Args> {}
