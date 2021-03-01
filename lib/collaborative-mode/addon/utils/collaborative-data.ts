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
  position: {x: number, y: number, z: number},
  rotation: {x: number, y: number, z: number},
  requested: boolean
}

export interface CursorPosition {
  // point?: {x: number, y: number, z: number},
  point?: number[],
  id?: String
}

export interface Click {
  id: String
}
export interface IdentifiableMesh {
   colabId: String
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
