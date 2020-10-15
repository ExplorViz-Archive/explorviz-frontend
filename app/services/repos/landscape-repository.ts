import Service from '@ember/service';
import Evented from '@ember/object/evented';
import Landscape from 'explorviz-frontend/models/landscape';
import { Application } from 'explorviz-frontend/utils/landscape-schemes/structure-data';

/**
* TODO
*
* @class Landscape-Repository-Service
* @extends Ember.Service
*/
export default class LandscapeRepository extends Service.extend(Evented) {
  latestLandscape: Landscape|null = null;

  latestApplication: Application|null = null;

  replayLandscape: Landscape|null = null;

  replayApplication: Application|null = null;

  triggerLatestLandscapeUpdate() {
    this.trigger('updatedLatestLandscape');
  }

  triggerLatestReplayLandscapeUpdate() {
    this.trigger('updatedReplayLandscape', this.get('replayLandscape'));
  }
}

declare module '@ember/service' {
  interface Registry {
    'repos/landscape-repository': LandscapeRepository;
  }
}
