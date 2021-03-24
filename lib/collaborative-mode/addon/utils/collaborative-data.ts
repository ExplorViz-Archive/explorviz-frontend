export enum CollaborativeEvents {
  MouseMove = 'mouse_move',
  MouseStop = 'mouse_stop',
  MouseOut = 'mouse_out',
  Perspective = 'perspective',
  SingleClick = 'single_click',
  DoubleClick = 'double_click',
  GetPerspective = 'get_perspective',
  PresentationModeActivated = 'presentation_mode_activated',
  PresentationModeDeactivated = 'presentation_mode_deactivated',
  UserInControl = 'user_in_control',
  OpenLandscapeView = 'open_landscape_view'
}

export interface Perspective {
  user?: string;
  position: number[],
  rotation: number[],
  requested: boolean
}

export interface CursorPosition {
  user?: string,
  point: number[],
  id?: string
}

export interface Click {
  user: string,
  id: string
}
export interface IdentifiableMesh {
  colabId: string
}

export interface SessionData {
  users: String[]
}
export interface UserJoinedMessage {
  user: string
}

export interface PresentationModeActivated {
  user: string
}

export interface PresentationModeDeactivated {
}

export function instanceOfIdentifiableMesh(object: any): object is IdentifiableMesh {
  return 'colabId' in object;
}

export interface Meeting {
  id: string,
  users: User[],
  presentationMode: boolean,
  adminId: string,
  presenterId: string
}

export interface User {
  name: string,
  color: string,
  admin: boolean,
  presenter: boolean
}
