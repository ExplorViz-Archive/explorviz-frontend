import { isPosition, Position } from "../util/position";
import { isQuaternion, Quaternion } from "../util/quaternion";

export const INITIAL_LANDSCAPE_EVENT = 'landscape';

type HighlightedComponent = {
    userID: string,
    appID: string,
    entityType: string,
    entityID: string,
    isHighlighted: boolean
};

type App = {
    id: string,
    position: Position,
    quaternion: Quaternion,
    openComponents: string[],
    highlightedComponents: HighlightedComponent[]
};

type Landscape = {
    position: Position,
    quaternion: Quaternion
};

export type InitialLandscapeMessage = {
    event: typeof INITIAL_LANDSCAPE_EVENT,
    openApps: App[],
    landscape: Landscape
};

function isHighlightedComponent(comp: any): comp is HighlightedComponent {
    return comp !== null 
        && typeof comp === 'object'
        && typeof comp.userID === 'string'
        && typeof comp.appID === 'string'
        && typeof comp.entityType === 'string'
        && typeof comp.entityID === 'string'
        && typeof comp.isHighlighted === 'boolean';
}

function isApp(app: any): app is App {
    return app !== null 
        && typeof app === 'object'
        && typeof app.id === 'string'
        && isPosition(app.position)
        && isQuaternion(app.quaternion)
        && Array.isArray(app.highlightedComponents)
        && app.highlightedComponents.every(isHighlightedComponent)
}

function isLandscape(landscape: any): landscape is Landscape {
    return landscape !== null 
        && typeof landscape === 'object'
        && isPosition(landscape.position)
        && isQuaternion(landscape.quaternion);
}

export function isInitialLandscapeMessage(msg: any): msg is InitialLandscapeMessage {
    return msg !== null 
        && typeof msg === 'object'
        && msg.event === INITIAL_LANDSCAPE_EVENT
        && Array.isArray(msg.openApps)
        && msg.openApps.evey(isApp)
        && isLandscape(msg.landscape);
} 