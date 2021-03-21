import THREE from 'three';
import LocalVrUser from 'virtual-reality/services/local-vr-user';
import VrApplicationRenderer from 'virtual-reality/utils/vr-rendering/vr-application-renderer';
import VrLandscapeRenderer from 'virtual-reality/utils/vr-rendering/vr-landscape-renderer';
import TextItem from '../items/text-item';
import TextbuttonItem from '../items/textbutton-item';
import UiMenu, { UiMenuArgs } from '../ui-menu';

export type ResetMenuArgs = UiMenuArgs & {
  localUser: LocalVrUser,
  vrApplicationRenderer: VrApplicationRenderer,
  vrLandscapeRenderer: VrLandscapeRenderer,
};

export default class ResetMenu extends UiMenu {
  private localUser: LocalVrUser;
  private vrApplicationRenderer: VrApplicationRenderer;
  private vrLandscapeRenderer: VrLandscapeRenderer;

  constructor({ localUser, vrApplicationRenderer, vrLandscapeRenderer, ...args }: ResetMenuArgs) {
    super(args);
    this.localUser = localUser;
    this.vrApplicationRenderer = vrApplicationRenderer;
    this.vrLandscapeRenderer = vrLandscapeRenderer;

    const textItem = new TextItem('Reset', 'title', '#ffffff', { x: 256, y: 20 }, 50, 'center');
    this.items.push(textItem);

    if (localUser.connectionStatus != 'online') {
      const question = new TextItem('Reset state and position?', 'question', '#ffffff', { x: 100, y: 148 }, 28, 'left');
      this.items.push(question);

      const noButton = new TextbuttonItem('no', 'No', {
        x: 100 - 20,
        y: 266,
      }, 158, 50, 28, '#555555', '#ffc338', '#929292');
      noButton.onTriggerDown = () => this.closeMenu();
      this.items.push(noButton);
      this.thumbpadTargets.push(noButton);

      const yesButton = new TextbuttonItem('yes', 'Yes', {
        x: 258 + 20,
        y: 266,
      }, 158, 50, 28, '#555555', '#ffc338', '#929292');
      yesButton.onTriggerDown = () => {
        this.resetAll();
        this.closeMenu()
      };
      this.items.push(yesButton);
      this.thumbpadTargets.push(yesButton);

      this.thumbpadAxis = 0;

    } else {
      const message = new TextItem('Not allowed when online.', 'message', '#ffffff', { x: 100, y: 148 }, 28, 'left');
      this.items.push(message);
    }

    this.redrawMenu();
  }

  private resetAll() {
    this.resetLocalUser();
    this.resetApplications();
    this.resetLandscape();
  }

  private resetLocalUser() {
    this.localUser.resetPosition();
  }

  private resetApplications() {
    this.vrApplicationRenderer.applicationGroup.clear();
  }

  private resetLandscape() {
    this.vrLandscapeRenderer.landscapeObject3D.rotation.x = -90 * THREE.MathUtils.DEG2RAD;
    this.vrLandscapeRenderer.landscapeObject3D.rotation.y = 0;
    this.vrLandscapeRenderer.landscapeObject3D.rotation.z = 0;
    this.vrLandscapeRenderer.centerLandscape();
  }
}
