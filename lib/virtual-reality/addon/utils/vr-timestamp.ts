import debugLogger from "ember-debug-logger";
import ReloadHandler from "explorviz-frontend/services/reload-handler";
import LocalVrUser from "virtual-reality/services/local-vr-user";
import VrMessageSender from "virtual-reality/services/vr-message-sender";
import DetachedMenuGroupContainer from "./vr-menus/detached-menu-group-container";
import VrApplicationRenderer from "./vr-rendering/vr-application-renderer";
import VrLandscapeRenderer from "./vr-rendering/vr-landscape-renderer";

type VrtTimestampServiceArgs = {
    timestamp: number, 
    interval: number, 
    localUser: LocalVrUser, 
    sender: VrMessageSender, 
    reloadHandler: ReloadHandler,
    vrLandscapeRenderer: VrLandscapeRenderer,
    vrApplicationRenderer: VrApplicationRenderer,
    detachedMenuGroups: DetachedMenuGroupContainer
};

export default class VrTimestampService {

    private debug = debugLogger('VrTimestampService');

    localUser: LocalVrUser;

    sender: VrMessageSender

    timestamp: number;

    interval: number;

    reloadHandler: ReloadHandler;

    vrLandscapeRenderer: VrLandscapeRenderer;

    vrApplicationRenderer: VrApplicationRenderer;

    detachedMenuGroups: DetachedMenuGroupContainer

    constructor({ timestamp, interval, localUser, sender, reloadHandler, vrLandscapeRenderer, vrApplicationRenderer, detachedMenuGroups }: VrtTimestampServiceArgs) {
        this.timestamp = timestamp;
        this.interval = interval;
        this.localUser = localUser;
        this.sender = sender;
        this.reloadHandler = reloadHandler;
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

    updateTimestamp(timestamp: number): Promise<void> {
        console.log('update timestamp', timestamp);

        if (this.localUser.isOnline) {
            this.sender.sendTimestampUpdate(timestamp)
        }
        return this.updateTimestampLocally(timestamp);
    }

    async updateTimestampLocally(timestamp: number): Promise<void> {
        try {
            // reset 
            this.detachedMenuGroups.forceRemoveAllDetachedMenus();
            this.vrApplicationRenderer.applicationGroup.clear();
            this.vrLandscapeRenderer.cleanUpLandscape();

            // update model
            this.timestamp = timestamp;
            const [structureData, dynamicData] = await this.reloadHandler.loadLandscapeByTimestamp(timestamp);
            
            await Promise.all([
                this.vrLandscapeRenderer.updateLandscapeData(structureData, dynamicData),
                this.vrApplicationRenderer.updateLandscapeData(structureData, dynamicData)
            ]);
        } catch (e) {
            this.debug('Landscape couldn\'t be requested!', e);
        }
    }
}

