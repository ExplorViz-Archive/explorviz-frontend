import Service from '@ember/service';
import ENV from 'explorviz-frontend/config/environment';
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';
import { inject as service } from "@ember/service";

export default Service.extend(FileSaverMixin, {

  session: service(),
  ajax: service('ajax'),
  
  //download file from backend server
  downloadFile(urlPath, savedFileName) {
    const { access_token } = this.get('session.data.authenticated');
    const url = `${ENV.APP.API_ROOT}${urlPath}`

    this.get('ajax').raw(url, {
      'id': this,
      headers: { 'Authorization': `Basic ${access_token}` },
      dataType: 'text',
      options: {
        arraybuffer: true
      }
    }
    ).then((content) => {
      this.saveFileAs(savedFileName, content.payload, 'text/plain');
    }).catch((error) => {

      this.debug("Could not download file", error);
      throw new Error("Could not download file. Enable debugging in console");

    });
  }


});
