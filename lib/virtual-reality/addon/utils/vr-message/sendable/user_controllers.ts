import { isControllers } from "../util/controllers";

export const USER_CONTROLLER_EVENT = 'user_controllers';

type Controllers = { controller1: string | null, controller2: string | null } | null;

export type UserControllerMessage = {
  event: typeof USER_CONTROLLER_EVENT,
  connect: Controllers,
  disconnect: Controllers
};

export function isUserControllerMessage(msg: any): msg is UserControllerMessage {
  return msg == null
    || typeof msg === 'object'
    && msg.event === USER_CONTROLLER_EVENT
    && isControllers(msg.connect)
    && isControllers(msg.disconnect)
}
