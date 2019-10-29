import Component from '@glimmer/component';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import AdditionalData from 'explorviz-frontend/services/additional-data';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import { action } from '@ember/object';

export default class SQLOpener extends Component {

  @service('additional-data')
  additionalData!: AdditionalData;

  @service('repos/landscape-repository')
  landscapeRepo!: LandscapeRepository;

  @action
  showSql() {
    const latestApplication = this.landscapeRepo.latestApplication;

    if(latestApplication !== null) {
      if (latestApplication.databaseQueries.length === 0){
        AlertifyHandler.showAlertifyMessage("No SQL statements found!");
        return;
      }
      this.additionalData.addComponent("visualization/page-setup/sidebar/sql-viewer");
      this.additionalData.openAdditionalData();
    }
  }

}
