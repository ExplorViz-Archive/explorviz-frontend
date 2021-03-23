import VrTimestampService from "virtual-reality/utils/vr-timestamp";
import ArrowbuttonItem from "../items/arrowbutton-item";
import TextItem from "../items/text-item";
import UiMenu, { UiMenuArgs } from "../ui-menu";

export type TimeMenuArgs = UiMenuArgs & {
  vrTimestampService: VrTimestampService
};

export default class TimeMenu extends UiMenu {

  vrTimestampService: VrTimestampService;

  date: Date;

  constructor({vrTimestampService,  ...args}: TimeMenuArgs) {
    super(args);

    this.vrTimestampService = vrTimestampService;
    this.date = new Date(vrTimestampService.timestamp);

    const title = new TextItem('Time', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(title);
    
    const timestampTextItem = new TextItem(this.date.toLocaleString(), 'date', '#ffffff', { x: 100, y: 140 }, 28, 'center');
    this.items.push(timestampTextItem);

    const timeBackButton = new ArrowbuttonItem('time-back', {
      x: 120,
      y: 160,
    }, 50, 60, '#ffc338', '#00e5ff', 'left');
    timeBackButton.onTriggerDown = (() => { this.date.setSeconds(this.date.getSeconds() - this.vrTimestampService.interval)});
    this.items.push(timeBackButton);

    const timeForthButton = new ArrowbuttonItem('time-forth', {
      x: 346,
      y: 160,
    }, 50, 60, '#ffc338', '#00e5ff', 'right');
    timeForthButton.onTriggerDown = (() => { this.date.setSeconds(this.date.getSeconds() + this.vrTimestampService.interval)});
    this.items.push(timeForthButton);

  }


}


