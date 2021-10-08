import { action } from '@ember/object';
import Component from '@glimmer/component';
import ConfigurationRepository, { ConfigurationItem } from 'explorviz-frontend/services/repos/configuration-repository';
import LandscapeTokenService from 'explorviz-frontend/services/landscape-token';
import { inject as service } from '@ember/service';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

interface IArgs {
  configurations: ConfigurationItem[];
  softwaremetrics: String[];
  showConfiguration: boolean;
  toggleConfigurationOverview(): void;
}

export default class ConfigurationOverview extends Component<IArgs> {
  @service('landscape-token')
  tokenService!: LandscapeTokenService;

  @service('repos/configuration-repository')
  configRepo!: ConfigurationRepository;

  get showConfiguration() {
    return this.args.showConfiguration;
  }

  @action
  toggleConfigOverview() {
    this.args.toggleConfigurationOverview();
  }

  @action
  checkConfigStatus(id: string) {
    const active = this.configRepo.getActiveConfigurations(this.tokenService.token!.value);
    return (active.includes(id));
  }

  @action
  toggleConfigStatus(id: string) {
    const landscapeToken = this.tokenService.token!.value;
    const status = this.checkConfigStatus(id);

    if (status) {
      this.configRepo.deactiveConfiguration(landscapeToken, id);
    } else {
      this.configRepo.activateConfiguration(landscapeToken, id);
    }
  }

  @action
  changeConfigName(configuration: ConfigurationItem, value: any) {
    const landscapeToken = this.tokenService.token!.value;
    let name;
    try {
      name = value.target.value;
      const update = {
        id: configuration.id,
        name,
        key: configuration.key,
        color: configuration.color,
        status: configuration.status,
      };
      this.configRepo.editConfiguration(landscapeToken, update);
    } catch (e) {
      // Selection failed ?
    }
  }

  @action
  changeConfigKey(configuration: ConfigurationItem, value: any) {
    const landscapeToken = this.tokenService.token!.value;
    let key;
    try {
      key = value.target.value;
      const update = {
        id: configuration.id,
        name: configuration.name,
        key,
        color: configuration.color,
        status: configuration.status,
      };
      this.configRepo.editConfiguration(landscapeToken, update);
    } catch (e) {
      // Selection failed ?
    }
  }

  @action
  changeConfigColor(configuration: ConfigurationItem, value: any) {
    const landscapeToken = this.tokenService.token!.value;
    let color;
    try {
      color = value.target.value;
      const update = {
        id: configuration.id,
        name: configuration.name,
        key: configuration.key,
        color,
        status: configuration.status,
      };
      this.configRepo.editConfiguration(landscapeToken, update);
    } catch (e) {
      // Selection failed ?
    }
  }

  @action
  deleteConfig(id: string) {
    const landscapeToken = this.tokenService.token!.value;
    this.configRepo.removeConfiguration(landscapeToken, id);
    AlertifyHandler.showAlertifySuccess('Configuration removed!');
  }

  @action
  addConfig(event: any) {
    const landscapeToken = this.tokenService.token!.value;
    try {
      const name: string = event.target[1].value;
      const key: string = event.target[2].value;
      const color: string = event.target[3].value;
      if (name && key && color && name !== '' && key !== '' && color !== '' && /^#[0-9A-F]{6}$/i.test(color)) {
        this.configRepo.addConfiguration(landscapeToken, name, key, color);
        AlertifyHandler.showAlertifySuccess('Configuration created!');
      } else {
        throw Error('Invalid Input!');
      }
    } catch (e) {
      AlertifyHandler.showAlertifyError('Creation failed: Invalid Input!');
    }
    event.preventDefault(); // Prevents page refresh after submit
  }
}
