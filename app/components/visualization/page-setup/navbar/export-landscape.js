import Component from '@ember/component';
import ENV from 'explorviz-frontend/config/environment';
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';
import { inject as service } from "@ember/service";

export default Component.extend(FileSaverMixin, {

  tagName: '',

  session: service(),
  ajax: service('ajax'),
  landscapeRepo: service("repos/landscape-repository"),

  actions: {
    //download currentLandscape from backend server, the returned file is base64 encoded
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

        this.debug("Could not download file", error);
        throw new Error("Could not download file. Enable debugging in console");

      });
    }
  }
});
