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

  // @ts-ignore
  @attr('number') requests!: number;

  // @ts-ignore
  @attr('string') technology!: string;

  // @ts-ignore
  @attr('number') averageResponseTime!: number;

  // @ts-ignore
  @belongsTo('application', { inverse: 'applicationCommunications' })
  sourceApplication!: DS.PromiseObject<Application> & Application;

  // @ts-ignore
  @belongsTo('application', { inverse: null })
  targetApplication!: DS.PromiseObject<Application> & Application;

  // @ts-ignore
  @belongsTo('clazz', { inverse: null })
  sourceClazz!: DS.PromiseObject<Clazz> & Clazz;

  // @ts-ignore
  @belongsTo('clazz', { inverse: null })
  targetClazz!: DS.PromiseObject<Clazz> & Clazz;

}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'applicationcommunication': ApplicationCommunication;
  }
}
