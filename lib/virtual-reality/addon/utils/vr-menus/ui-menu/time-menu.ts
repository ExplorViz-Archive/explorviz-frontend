import VRControllerButtonBinding from "virtual-reality/utils/vr-controller/vr-controller-button-binding";
import VRControllerThumbpadBinding from "virtual-reality/utils/vr-controller/vr-controller-thumbpad-binding";
import VrTimestampService from "virtual-reality/utils/vr-timestamp";
import ArrowbuttonItem from "../items/arrowbutton-item";
import TextItem from "../items/text-item";
import TextbuttonItem from "../items/textbutton-item";
import UiMenu, { UiMenuArgs } from "../ui-menu";
import TitleItem from "../items/title-item";

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

    const title = new TitleItem({
      text: 'Time',
      position: { x: 256, y: 20 },
    });
    this.items.push(title);

    this.timestampTextItem = new TextItem({
      text: this.date.toLocaleString(),
      color: '#ffffff',
      fontSize: 28,
      alignment: 'center',
      position: { x: 256, y: 140 },
    });
    this.items.push(this.timestampTextItem);

    this.timeBackButton = new ArrowbuttonItem({
      direction: 'left',
      position: { x: 140, y: 200 },
      width: 50,
      height: 60,
      onTriggerDown: () => {
        this.setDateBack();
        this.redrawMenu();
      }
    });
    this.items.push(this.timeBackButton);

    this.timeForthButton = new ArrowbuttonItem({
      direction: 'right',
      position: { x: 326, y: 200 },
      width: 50,
      height: 60,
      onTriggerDown: () => {
        this.setDateForth();
        this.redrawMenu();
      }
    });
    this.items.push(this.timeForthButton);

    this.selectButton = new TextbuttonItem({
      text: 'Select',
      position: { x: 100, y: 320, },
      width: 316,
      height: 50,
      fontSize: 28,
      onTriggerDown: () => {
        this.vrTimestampService.updateTimestamp(this.date.getTime());
        this.closeMenu();
      }
    });
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
    this.date.setTime(this.date.getTime() - this.vrTimestampService.timestampInterval * this.msPerSeconds);
  }

  setDateForth() {
  this.date.setTime(this.date.getTime() + this.vrTimestampService.timestampInterval * this.msPerSeconds);
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
