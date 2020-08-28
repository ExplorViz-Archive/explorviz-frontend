export default class VrController {
  gamepad: Gamepad;

  axes = [0, 0];

  thumbpadCallback: ((axes: number[]) => void) | null = null;

  thumbpadUpCallback: (() => void) | null = null;

  thumbpadDownCallback: (() => void) | null = null;

  thumbpadIsPressed = false;

  triggerUpCallback: (() => void) | null = null;

  triggerDownCallback: (() => void) | null = null;

  triggerIsPressed = false;

  gripUpCallback: (() => void) | null = null;

  gripDownCallback: (() => void) | null = null;

  gripIsPressed = false;

  menuUpCallback: (() => void) | null = null;

  menuDownCallback: (() => void) | null = null;

  menuIsPressed = false;

  timestamp = 0;

  constructor(gamepad: Gamepad) {
    this.gamepad = gamepad;
  }

  update() {
    const { gamepad } = this;

    const THUMBPAD_BUTTON = 0;
    const TRIGGER_BUTTON = 1;
    const GRIP_BUTTON = 2;
    const MENU_BUTTON = 3;

    if (gamepad) {
      const { timestamp } = gamepad;

      // Ensure that gamepad data is fresh
      if (this.timestamp === timestamp) {
        return;
      }
      this.timestamp = timestamp;

      // Handle change in joystick / thumbpad position
      if (this.axes[0] !== gamepad.axes[0] || this.axes[1] !== gamepad.axes[1]) {
        [this.axes[0], this.axes[1]] = gamepad.axes;
        if (this.thumbpadCallback) {
          this.thumbpadCallback(this.axes);
        }
      }

      // Handle clicked / released thumbpad
      if (this.thumbpadIsPressed !== gamepad.buttons[THUMBPAD_BUTTON].pressed) {
        this.thumbpadIsPressed = gamepad.buttons[THUMBPAD_BUTTON].pressed;
        if (this.thumbpadIsPressed && this.thumbpadDownCallback) {
          this.thumbpadDownCallback();
        } else if (!this.thumbpadIsPressed && this.thumbpadUpCallback) {
          this.thumbpadUpCallback();
        }
      }

      // Handle clicked / released trigger
      if (this.triggerIsPressed !== gamepad.buttons[TRIGGER_BUTTON].pressed) {
        this.triggerIsPressed = gamepad.buttons[TRIGGER_BUTTON].pressed;
        if (this.triggerIsPressed && this.triggerDownCallback) {
          this.triggerDownCallback();
        } else if (!this.triggerIsPressed && this.triggerUpCallback) {
          this.triggerUpCallback();
        }
      }

      // Handle clicked released grip button
      if (gamepad.buttons[GRIP_BUTTON]
        && this.gripIsPressed !== gamepad.buttons[GRIP_BUTTON].pressed) {
        this.gripIsPressed = gamepad.buttons[GRIP_BUTTON].pressed;
        if (this.gripIsPressed && this.gripDownCallback) {
          this.gripDownCallback();
        } else if (!this.gripIsPressed && this.gripUpCallback) {
          this.gripUpCallback();
        }
      }

      // Handle clicked / released menu button
      if (gamepad.buttons[MENU_BUTTON]
        && this.menuIsPressed !== gamepad.buttons[GRIP_BUTTON].pressed) {
        this.menuIsPressed = gamepad.buttons[MENU_BUTTON].pressed;
        if (this.menuIsPressed && this.menuDownCallback) {
          this.menuDownCallback();
        } else if (!this.menuIsPressed && this.menuUpCallback) {
          this.menuUpCallback();
        }
      }
    }
  }
}
