export type Controllers = { controller1: string|null, controller2: string|null } | null;

export function isControllers(controllers: any): controllers is Controllers {
    return controllers == null
        || typeof controllers === 'object'
        && (typeof controllers.controller1 === 'string' || controllers.controller1 === null)
        && (typeof controllers.controller2 === 'string' || controllers.controller2 === null);
}
