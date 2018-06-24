import Component from '@ember/component';
import { inject as service } from "@ember/service";
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';
import ENV from 'explorviz-frontend/config/environment';

export default Component.extend(AlertifyHandler, FileSaverMixin, {

  ajax: service('ajax'),
  landscapeRepo: service("repos/landscape-repository"),
  renderingService: service("rendering-service"),
  reloadHandler: service("reload-handler"),
  viewImporter: service("view-importer"),
  session: service(),

  actions: {

    exportState() {
      // Pause timeshift
      this.get('reloadHandler').stopExchange();
      // Update query parameters
      this.get('urlBuilder').requestURL();

      this.set('viewImporter.importedURL', true);

      this.set('timestamp', this.get('state').timestamp);
      this.set('appID', this.get('state').appID);

      this.set('camX', this.get('state').camX);
      this.set('camY', this.get('state').camY);
      this.set('camZ', this.get('state').camZ);

      // handle landscape or application
      if(this.get('showLandscape')){
        this.set('condition', this.get('state').landscapeCondition);
      }
      else{
        this.set('condition', this.get('state').appCondition);
      }
    },

    resetView() {
      this.set('viewImporter.importedURL', false);
      this.get('renderingService').reSetupScene();
      this.get('reloadHandler').startExchange();
    },

    exportLandscape(){
      const currentLandscape = this.get('landscapeRepo.latestLandscape');
      const currentTimestamp = currentLandscape.get('timestamp');
      const currentCalls = currentLandscape.get('overallCalls');

      const { access_token } = this.get('session.data.authenticated');

      this.get('ajax').raw(ENV.APP.API_ROOT + '/landscape/export/' + currentTimestamp, {
        'id':this,
        headers: { 'Authorization': `Basic ${access_token}` },
        dataType: 'text',
        options: {
          arraybuffer: true
        }
      }
      ).then((content) => {
        this.saveFileAs(currentTimestamp + '-' + currentCalls +'.expl', content.payload, 'text/plain');
      }).catch((error) => {
        this.debug('error in exportLandscape', error);
      });
    },

    toggleTimeline() {
      this.set('renderingService.showTimeline', !this.get('renderingService.showTimeline'));
    }

  }

});
