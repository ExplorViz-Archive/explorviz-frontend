import Route from '@ember/routing/route';

export default class ConfigurationIndexRoute extends Route {

  beforeModel() {
    this.transitionTo('configuration.settings');
  }
}
