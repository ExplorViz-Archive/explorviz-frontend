import LocalVrUser from "virtual-reality/services/local-vr-user";
import VrMessageSender from "virtual-reality/services/vr-message-sender";
import DetachedMenuGroupContainer from "./vr-menus/detached-menu-group-container";
import VrApplicationRenderer from "./vr-rendering/vr-application-renderer";
import VrLandscapeRenderer from "./vr-rendering/vr-landscape-renderer";


export default class VrTimestampService {

    localUser: LocalVrUser;

    sender: VrMessageSender

    timestamp: number;

    interval: number;

    updateModel: (timestamp: number) => void;

    vrLandscapeRenderer: VrLandscapeRenderer;

    vrApplicationRenderer: VrApplicationRenderer;

    detachedMenuGroups: DetachedMenuGroupContainer

    constructor({ timestamp, interval, localUser, sender, updateModel, vrLandscapeRenderer, vrApplicationRenderer, detachedMenuGroups }:
        { timestamp: number, interval: number, localUser: LocalVrUser, sender: VrMessageSender, 
            updateModel(timestamp: number): void, vrLandscapeRenderer: VrLandscapeRenderer,
            vrApplicationRenderer: VrApplicationRenderer, detachedMenuGroups: DetachedMenuGroupContainer}) {
        this.timestamp = timestamp;
        this.interval = interval;
        this.localUser = localUser;
        this.sender = sender;
        this.updateModel = updateModel;
        this.vrLandscapeRenderer = vrLandscapeRenderer;
        this.vrApplicationRenderer = vrApplicationRenderer;
        this.detachedMenuGroups = detachedMenuGroups;

    }

    updateLandscapeToken(landscapeToken: string, timestamp: number): Promise<void> {
        // TODO implement me
        console.log('update landscape', landscapeToken, timestamp);
        this.timestamp = timestamp;
        return Promise.resolve();
    }

    updateTimestamp(timestamp: number) {
        console.log('update timestamp', timestamp);

        if (this.localUser.isOnline) {
            this.sender.sendTimestampUpdate(timestamp)
        }
        this.updateTimestampLocally(timestamp);
    }

    updateTimestampLocally(timestamp: number) {
        // reset 
        this.detachedMenuGroups.forceRemoveAllDetachedMenus();
        this.vrApplicationRenderer.applicationGroup.clear();
        this.vrLandscapeRenderer.cleanUpLandscape();

        // update model
        this.updateModel(timestamp);
        this.timestamp = timestamp;

        // render landscape
        this.vrLandscapeRenderer.populateLandscape();
    }


}

