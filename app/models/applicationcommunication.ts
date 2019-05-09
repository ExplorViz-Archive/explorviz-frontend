import DS from 'ember-data';
import DrawEdgeEntity from './drawedgeentity';
import Application from './application';
import Clazz from './clazz';

const { attr, belongsTo } = DS;

/**
 * Ember model for an ApplicationCommunication.
 *
 * @class ApplicationCommunication-Model
 * @extends DrawEdgeEntity-Model
 *
 * @module explorviz
 * @submodule model.meta
 */
export default class ApplicationCommunication extends DrawEdgeEntity {

  @attr('number') requests!: number;

  @attr('string') technology!: string;

  @attr('number') averageResponseTime!: number;

  @belongsTo('application', { inverse: 'applicationCommunications' })
  sourceApplication!: DS.PromiseObject<Application> & Application;

  @belongsTo('application', { inverse: null })
  targetApplication!: DS.PromiseObject<Application> & Application;

  @belongsTo('clazz', { inverse: null })
  sourceClazz!: DS.PromiseObject<Clazz> & Clazz;

  @belongsTo('clazz', { inverse: null })
  targetClazz!: DS.PromiseObject<Clazz> & Clazz;

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'applicationcommunication': ApplicationCommunication;
  }
}
