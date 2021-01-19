export const USER_CONTROLLER_EVENT = 'user_controllers';

type Controllers = { controller1: string|null, controller2: string|null };

export type UserControllerMessage = {
    event: typeof USER_CONTROLLER_EVENT,
    connect: Controllers,
    disconnect: Controllers
};

function isControllers(controllers: any): controllers is Controllers {
    return controllers !== null
        && typeof controllers === 'object'
        && (typeof controllers.controller1 === 'string' || controllers.controller1 === null)
        && (typeof controllers.controller2 === 'string' || controllers.controller2 === null);
}

export function isUserControllerMessage(msg: any): msg is UserControllerMessage {
    return msg !== null
        && typeof msg === 'object'
        && msg.event === USER_CONTROLLER_EVENT
        && isControllers(msg.connect)
        && isControllers(msg.disconnect)
}