import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';

interface Args {
  addComponent(componentPath: string): void
}

export default class SQLOpener extends Component<Args> {
  @service('repos/landscape-repository')
  landscapeRepo!: LandscapeRepository;

  @action
  showSql() {
    const { latestApplication } = this.landscapeRepo;

    if (latestApplication !== null) {
      if (latestApplication.databaseQueries.length === 0) {
        AlertifyHandler.showAlertifyMessage('No SQL statements found!');
        return;
      }
      this.args.addComponent('sql-viewer');
    }
  }
}
