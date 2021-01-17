export interface Perspective {
  position: {x: number, y: number, z: number},
  rotation: {x: number, y: number, z: number}
}

export interface CursorPosition {
  x: number,
  y: number,
}

export interface Click {
  id: String
}

export interface IdentifiableMesh {
   colabId: String
}

export function instanceOfIdentifiableMesh(object: any): object is IdentifiableMesh {
  return 'colabId' in object;
}