import DetachedMenuGroupsService from "virtual-reality/services/detached-menu-groups";
import LocalVrUser from 'virtual-reality/services/local-vr-user';
import VrApplicationRenderer from 'virtual-reality/services/vr-application-renderer';
import VrLandscapeRenderer from "../../../services/vr-landscape-renderer";
import TextItem from '../items/text-item';
import TextbuttonItem from '../items/textbutton-item';
import TitleItem from "../items/title-item";
import UiMenu, { UiMenuArgs } from '../ui-menu';

export type ResetMenuArgs = UiMenuArgs & {
  localUser: LocalVrUser,
  vrApplicationRenderer: VrApplicationRenderer,
  vrLandscapeRenderer: VrLandscapeRenderer,
  detachedMenuGroups: DetachedMenuGroupsService
};

export default class ResetMenu extends UiMenu {
  private localUser: LocalVrUser;
  private vrApplicationRenderer: VrApplicationRenderer;
  private vrLandscapeRenderer: VrLandscapeRenderer;
  private detachedMenuGroups: DetachedMenuGroupsService;

  constructor({ localUser, vrApplicationRenderer, vrLandscapeRenderer, detachedMenuGroups, ...args }: ResetMenuArgs) {
    super(args);
    this.localUser = localUser;
    this.vrApplicationRenderer = vrApplicationRenderer;
    this.vrLandscapeRenderer = vrLandscapeRenderer;
    this.detachedMenuGroups = detachedMenuGroups;

    const textItem = new TitleItem({
      text: 'Reset',
      position: { x: 256, y: 20 },
    });
    this.items.push(textItem);

    if (localUser.connectionStatus != 'online') {
      const question = new TextItem({
        text: 'Reset state and position?',
        color: '#ffffff',
        fontSize: 28,
        position: { x: 100, y: 148 },
      });
      this.items.push(question);

      const noButton = new TextbuttonItem({
        text: 'No',
        position: { x: 100 - 20, y: 266, },
        width: 158,
        height: 50,
        fontSize: 28,
        onTriggerDown: () => this.closeMenu()
      });
      this.items.push(noButton);
      this.thumbpadTargets.push(noButton);

      const yesButton = new TextbuttonItem({
        text: 'Yes',
        position: { x: 258 + 20, y: 266, },
        width: 158,
        height: 50,
        fontSize: 28,
        onTriggerDown: () => this.resetAll()
      });
      this.items.push(yesButton);
      this.thumbpadTargets.push(yesButton);

      this.thumbpadAxis = 0;

    } else {
      const message = new TextItem({
        text: 'Not allowed when online.',
        color: '#ffffff',
        fontSize:  28,
        position: { x: 100, y: 148 },
      });
      this.items.push(message);
    }

    this.redrawMenu();
  }

  private resetAll() {
    this.resetLocalUser();
    this.resetApplications();
    this.resetDetachedMenus();
    this.resetLandscape();
    this.closeMenu();
  }

  private resetLocalUser() {
    this.localUser.resetPositionAndRotation();
  }

  private resetDetachedMenus() {
    this.detachedMenuGroups.removeAllDetachedMenusLocally();
  }

  private resetApplications() {
    this.vrApplicationRenderer.removeAllApplicationsLocally();
  }

  private resetLandscape() {
    this.vrLandscapeRenderer.centerLandscape();
  }
}
