import ApplicationSerializer from './application';

/**
 * TODO
 *
 * @class SystemSerializer
 * @extends ApplicationSerializer
 */
export default class SystemSerializer extends ApplicationSerializer {
  // This attribute will declare to serialize hasMany-relationships
  attrs = {
    nodegroups: {
      serialize: true,
    },
  };
}
