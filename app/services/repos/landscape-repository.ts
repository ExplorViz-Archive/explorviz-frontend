import Service from '@ember/service';
import Evented from '@ember/object/evented';
import Landscape from 'explorviz-frontend/models/landscape';
import Application from 'explorviz-frontend/models/application';

/**
* TODO
*
* @class Landscape-Repository-Service
* @extends Ember.Service
*/
export default class LandscapeRepository extends Service.extend(Evented) {

  latestLandscape:Landscape|null = null;
  latestApplication:Application|null = null;

  replayLandscape:Landscape|null = null;
  replayApplication:Application|null = null;

  triggerLatestLandscapeUpdate() {
    this.trigger("updated", this.get("latestLandscape"));
  }

  triggerLatestReplayLandscapeUpdate() {
    this.trigger("updated", this.get("replayLandscape"));
  }

}

declare module "@ember/service" {
  interface Registry {
    "repos/landscape-repository": LandscapeRepository;
  }
}
