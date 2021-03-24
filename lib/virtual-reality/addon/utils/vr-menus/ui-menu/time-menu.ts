import VRControllerButtonBinding from "virtual-reality/utils/vr-controller/vr-controller-button-binding";
import VRControllerThumbpadBinding from "virtual-reality/utils/vr-controller/vr-controller-thumbpad-binding";
import VrTimestampService from "virtual-reality/utils/vr-timestamp";
import ArrowbuttonItem from "../items/arrowbutton-item";
import TextItem from "../items/text-item";
import TextbuttonItem from "../items/textbutton-item";
import UiMenu, { UiMenuArgs } from "../ui-menu";

export type TimeMenuArgs = UiMenuArgs & {
  vrTimestampService: VrTimestampService
};

export default class TimeMenu extends UiMenu {

  readonly msPerSeconds: number = 1000;

  vrTimestampService: VrTimestampService;

  date: Date;

  timestampTextItem: TextItem;

  timeForthButton: ArrowbuttonItem;

  timeBackButton: ArrowbuttonItem;

  selectButton: TextbuttonItem;

  constructor({ vrTimestampService, ...args }: TimeMenuArgs) {
    super(args);

    this.vrTimestampService = vrTimestampService;
    this.date = new Date(vrTimestampService.timestamp);

    const title = new TextItem('Time', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(title);

    this.timestampTextItem = new TextItem(this.date.toLocaleString(), 'date', '#ffffff', { x: 256, y: 140 }, 28, 'center');
    this.items.push(this.timestampTextItem);

    this.timeBackButton = new ArrowbuttonItem('time-back', {
      x: 140,
      y: 200,
    }, 50, 60, '#ffc338', '#00e5ff', 'left');
    this.timeBackButton.onTriggerDown = (() => { 
      this.setDateBack();
      this.redrawMenu();
    });
    this.items.push(this.timeBackButton);

    this.timeForthButton = new ArrowbuttonItem('time-forth', {
      x: 326,
      y: 200,
    }, 50, 60, '#ffc338', '#00e5ff', 'right');
    this.timeForthButton.onTriggerDown = (() => {
      this.setDateForth();
      this.redrawMenu();
    });
    this.items.push(this.timeForthButton);

    this.selectButton = new TextbuttonItem('select', 'Select', {
      x: 100,
      y: 320,
    }, 316, 50, 28, '#555555', '#ffc338', '#929292');
    this.items.push(this.selectButton);

    this.redrawMenu();

  }

  onUpdateMenu(delta: number) {
    super.onUpdateMenu(delta);
    const nextDate = this.date.toLocaleString();
    if (nextDate != this.timestampTextItem.text) {
      this.timestampTextItem.text = nextDate;
      this.redrawMenu();
    }
  }

  setDateBack() {
    this.date.setTime(this.date.getTime() - this.vrTimestampService.interval * this.msPerSeconds);
  }

  setDateForth() {
  this.date.setTime(this.date.getTime() + this.vrTimestampService.interval * this.msPerSeconds);
  }

  makeThumbpadBinding() {
    return new VRControllerThumbpadBinding({ labelLeft: 'Earlier', labelRight: 'Later' }, {
      onThumbpadDown: ((_, axes) => {
        if(axes[0] > 0) {
          this.setDateForth();
          this.timeForthButton.enableHoverEffectByButton();
        } else {
          this.setDateBack();
          this.timeBackButton.enableHoverEffectByButton();
        }
        this.redrawMenu();
      }),
      onThumbpadUp: (() => {
        this.timeForthButton.resetHoverEffectByButton();
        this.timeBackButton.resetHoverEffectByButton();
        this.redrawMenu();
      })
    });
  }

  makeTriggerButtonBinding() {
    return new VRControllerButtonBinding('Select', {
      onButtonDown: (() => {
        this.selectButton.enableHoverEffectByButton();
        this.redrawMenu();
      }),
      onButtonUp: (() => {
        this.selectButton.resetHoverEffectByButton();
        this.redrawMenu();
      })
    });
  }

}


