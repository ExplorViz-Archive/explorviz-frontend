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

  replayLandscape = null;
  replayApplication = null;

  triggerLatestLandscapeUpdate() {
    this.trigger("updated", this.get("latestLandscape"));
  }

}

declare module "@ember/service" {
  interface Registry {
    "repos/landscape-repository": LandscapeRepository;
  }
}
