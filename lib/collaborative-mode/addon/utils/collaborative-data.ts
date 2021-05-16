export enum CollaborativeEvents {
  MouseMove = 'mouse_move',
  MouseStop = 'mouse_stop',
  MouseOut = 'mouse_out',
  Perspective = 'perspective',
  SingleClick = 'single_click',
  DoubleClick = 'double_click',
  RequestLastPosition = 'request_last_position',
  TransferControl = 'transfer_control',
  OpenLandscapeView = 'open_landscape_view',
  CreateMeeting = 'create_meeting',
  JoinMeeting = 'join_meeting',
  LeaveMeeting = 'leave_meeting',
  ApplicationOpened = 'application_opened',
  TogglePresentationMode = 'toggle_presentation_mode',
}

export interface Perspective {
  user?: string;
  position: number[];
  rotation: number[];
  requested: boolean;
}

export interface CursorPosition {
  user?: string;
  point: number[];
  id?: string;
}

export interface Click {
  user: string;
  id: string;
}

export interface UserJoinedMessage {
  user: string;
}

export interface PresentationModeActivated {
  user: string;
}

export interface PresentationModeDeactivated {
}

export interface Meeting {
  id: string;
  landscapeToken: string;
  users: User[];
  presentationMode: boolean;
  adminId: string;
  presenterId: string;
  applicationId: string;
}

export interface User {
  name: string;
  color: string;
  admin: boolean;
  presenter: boolean;
}
