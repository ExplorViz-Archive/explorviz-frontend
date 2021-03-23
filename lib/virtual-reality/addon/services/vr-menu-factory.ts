import Service, { inject as service } from '@ember/service';
import { AjaxServiceClass } from 'ember-ajax/services/ajax';
import DeltaTimeService from 'virtual-reality/services/delta-time';
import GrabbedObjectService from 'virtual-reality/services/grabbed-object';
import LocalVrUser from "virtual-reality/services/local-vr-user";
import VrMessageSender from 'virtual-reality/services/vr-message-sender';
import { EntityMesh } from 'virtual-reality/utils/vr-helpers/detail-info-composer';
import GrabMenu, { GrabbableObject } from "virtual-reality/utils/vr-menus/ui-less-menu/grab-menu";
import PingMenu from "virtual-reality/utils/vr-menus/ui-less-menu/ping-menu";
import ScaleMenu, { SharedScaleMenuState } from "virtual-reality/utils/vr-menus/ui-less-menu/scale-menu";
import CameraMenu from 'virtual-reality/utils/vr-menus/ui-menu/camera-menu';
import ConnectionBaseMenu from 'virtual-reality/utils/vr-menus/ui-menu/connection/base';
import JoinMenu from "virtual-reality/utils/vr-menus/ui-menu/connection/join-menu";
import DetailInfoMenu from 'virtual-reality/utils/vr-menus/ui-menu/detail-info-menu';
import HintMenu from "virtual-reality/utils/vr-menus/ui-menu/hud/hint-menu";
import MessageBoxMenu from "virtual-reality/utils/vr-menus/ui-menu/hud/message-box-menu";
import ResetMenu from 'virtual-reality/utils/vr-menus/ui-menu/reset-menu';
import VrApplicationRenderer from 'virtual-reality/utils/vr-rendering/vr-application-renderer';
import VrLandscapeRenderer from 'virtual-reality/utils/vr-rendering/vr-landscape-renderer';
import ConnectingMenu from "../utils/vr-menus/ui-menu/connection/connecting-menu";
import OfflineMenu from "../utils/vr-menus/ui-menu/connection/offline-menu";
import OnlineMenu from "../utils/vr-menus/ui-menu/connection/online-menu";
import ZoomMenu from "../utils/vr-menus/ui-menu/zoom-menu";
import RemoteVrUserService from "./remote-vr-users";
import SettingsMenu from "../utils/vr-menus/ui-menu/settings-menu";
import MainMenu from "../utils/vr-menus/ui-menu/main-menu";

type InjectedValues = {
  vrApplicationRenderer: VrApplicationRenderer,
  vrLandscapeRenderer: VrLandscapeRenderer,
};

export default class VrMenuFactoryService extends Service {
  @service('local-vr-user')
  private localUser!: LocalVrUser;

  @service('remote-vr-users')
  private remoteUsers!: RemoteVrUserService;

  @service('ajax')
  private ajax!: AjaxServiceClass;

  @service('vr-message-sender')
  private sender!: VrMessageSender;

  @service('delta-time')
  private deltaTimeService!: DeltaTimeService;

  @service('grabbed-object')
  private grabbedObjectService!: GrabbedObjectService;

  private vrApplicationRenderer!: VrApplicationRenderer;
  private vrLandscapeRenderer!: VrLandscapeRenderer;

  injectValues({
    vrApplicationRenderer,
    vrLandscapeRenderer
  }: InjectedValues) {
    this.vrApplicationRenderer = vrApplicationRenderer;
    this.vrLandscapeRenderer = vrLandscapeRenderer;
  }

  buildMainMenu(): MainMenu {
    return new MainMenu({ menuFactory: this });
  }

  // #region SETTINGS MENUS

  buildSettingsMenu(): SettingsMenu {
    return new SettingsMenu({
      labelGroups: [
        this.localUser.controller1?.labelGroup,
        this.localUser.controller2?.labelGroup,
      ],
      menuFactory: this,
    });
  }

  buildCameraMenu(): CameraMenu {
    return new CameraMenu({
      cameraObject3D: this.localUser.userGroup,
      menuFactory: this,
    });
  }

  // #endregion SETTINGS MENUS

  // #region CONNECTION MENUS

  buildConnectionMenu(): ConnectionBaseMenu {
    switch (this.localUser.connectionStatus) {
      case 'offline': return this.buildOfflineMenu();
      case 'connecting': return this.buildConnectingMenu();
      case 'online': return this.buildOnlineMenu();
    }
  }

  buildOfflineMenu(): OfflineMenu {
    return new OfflineMenu({
      localUser: this.localUser,
      ajax: this.ajax,
      menuFactory: this,
    });
  }

  buildConnectingMenu(): ConnectingMenu {
    return new ConnectingMenu({
      localUser: this.localUser,
      menuFactory: this,
    });
  }

  buildOnlineMenu(): OnlineMenu {
    return new OnlineMenu({
      localUser: this.localUser,
      remoteUsers: this.remoteUsers,
      menuFactory: this,
    });
  }

  buildJoinMenu(): JoinMenu {
    return new JoinMenu({
      localUser: this.localUser,
      ajax: this.ajax,
      menuFactory: this,
    });
  }

  // #endregion CONNECTION MENUS

  // #region TOOL MENUS

  buildZoomMenu(): ZoomMenu {
    return new ZoomMenu({
      renderer: this.localUser.renderer,
      scene: this.localUser.scene,
      headsetCamera: this.localUser.defaultCamera,
      menuFactory: this,
    });
  }

  buildPingMenu(): PingMenu {
    return new PingMenu({
      scene: this.localUser.scene,
      sender: this.sender,
      menuFactory: this
    });
  }

  buildInfoMenu(object: EntityMesh): DetailInfoMenu {
    return new DetailInfoMenu({ object, menuFactory: this });
  }

  buildGrabMenu(grabbedObject: GrabbableObject): GrabMenu {
    return new GrabMenu({
      grabbedObject,
      grabbedObjectService: this.grabbedObjectService,
      deltaTimeService: this.deltaTimeService,
      menuFactory: this
    });
  }

  buildScaleMenus(grabbedObject: GrabbableObject): { scaleMenu1: ScaleMenu, scaleMenu2: ScaleMenu } {
    const sharedState = new SharedScaleMenuState(grabbedObject);
    return {
      scaleMenu1: new ScaleMenu({ sharedState, menuFactory: this }),
      scaleMenu2: new ScaleMenu({ sharedState, menuFactory: this })
    };
  }

  // #endregion TOOL MENUS

  // #region HUD MENUS

  buildHintMenu(title: string, text: string | undefined = undefined): HintMenu {
    return new HintMenu({ title, text, menuFactory: this });
  }

  buildMessageBoxMenu(args: { title: string, text?: string, color: string, time: number }): MessageBoxMenu {
    return new MessageBoxMenu({
      menuFactory: this,
      ...args,
    });
  }

  // #endregion HUD MENUS

  // #region OTHER MENUS

  buildResetMenu(): ResetMenu {
    return new ResetMenu({
      localUser: this.localUser,
      vrApplicationRenderer: this.vrApplicationRenderer,
      vrLandscapeRenderer: this.vrLandscapeRenderer,
      menuFactory: this,
    });
  }

  // #endregion OTHER MENUS
}

declare module '@ember/service' {
  interface Registry {
    'vr-menu-factory': VrMenuFactoryService;
  }
}
