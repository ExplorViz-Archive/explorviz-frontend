import ApplicationSerializer from './application';

/**
 * TODO
 *
 * @class LandscapeSerializer
 * @extends ApplicationSerializer
 */
export default class LandscapeSerializer extends ApplicationSerializer {
  // This attribute will declare to serialize hasMany-relationships
  attrs = {
    systems: {
      serialize: true,
    },
    totalApplicationCommunications: {
      serialize: true,
    },
  };
}
