import BaseEntity from './baseentity';
import DS from 'ember-data';
const { attr } = DS;

/**
<<<<<<< HEAD
 * Ember model for an event occurring in the landscape.
 *
 * @class Event-Model
 * @extends BaseEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default BaseEntity.extend({

    timestamp: attr('number'),
    eventType: attr('string'),
    eventMessage: attr('string'),

    isSelected: attr('boolean', {defaultValue: false}),

});
