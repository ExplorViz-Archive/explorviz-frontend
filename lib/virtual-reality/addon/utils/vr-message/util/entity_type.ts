export const NODE_ENTITY_TYPE = 'node';
export const APPLICATION_ENTITY_TYPE = 'application';
export const COMPONENT_ENTITY_TYPE = 'component';
export const CLASS_ENTITY_TYPE = 'clazz';
export const CLASS_COMMUNICATION_ENTITY_TYPE = 'clazzCommunication';

export type EntityType = typeof NODE_ENTITY_TYPE | typeof APPLICATION_ENTITY_TYPE | typeof COMPONENT_ENTITY_TYPE |
    typeof CLASS_ENTITY_TYPE | typeof CLASS_COMMUNICATION_ENTITY_TYPE

const entityTypes = [NODE_ENTITY_TYPE, APPLICATION_ENTITY_TYPE, COMPONENT_ENTITY_TYPE, CLASS_ENTITY_TYPE, CLASS_COMMUNICATION_ENTITY_TYPE];

export function isEntityType(entityType: any): entityType is EntityType {
    return typeof entityType === 'string' && entityTypes.includes(entityType);
}