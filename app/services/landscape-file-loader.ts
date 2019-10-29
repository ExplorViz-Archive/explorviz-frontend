import Service, { inject as service } from '@ember/service';
import ENV from 'explorviz-frontend/config/environment';
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';
import { AjaxServiceClass } from 'ember-ajax/services/ajax';
import AlertifyHandler from 'explorviz-frontend/utils/alertify-handler';
import debugLogger from 'ember-debug-logger';
import DS from 'ember-data';
import { get } from '@ember/object';

/**
 * This Service offers the functionality to download and upload a landscape
 *
 * @class LandscapeFileLoader
 * @extends {Service}
 */
export default class LandscapeFileLoader extends Service.extend(FileSaverMixin) {

  debug = debugLogger();

  @service('session') session !: any;
  @service('store') store !: DS.Store;
  @service('ajax') ajax !: AjaxServiceClass;

  fileExtension: string = ".json";

  // downloads a landscape from the backend
  downloadLandscape(timestamp: number, totalRequests: number) {
    let { access_token } = get(this.session, 'data.authenticated');

    const urlPath = `/v1/landscapes/download?timestamp=${timestamp}`;
    const savedFileName = timestamp + "-" + totalRequests + get(this, 'fileExtension');
    const url = `${ENV.APP.API_ROOT}${urlPath}`

    this.get('ajax').raw(url, {
      //@ts-ignore
      'id': this,
      headers: { 'Authorization': `Bearer ${access_token}` },
      contentType: false,
      options: {
        arraybuffer: true
      }
    }
    ).then((content: any) => {
      //@ts-ignore
      this.saveFileAs(savedFileName, JSON.stringify(content.payload), 'application/json');
      AlertifyHandler.showAlertifySuccess("Landscape with timestamp [" + timestamp + "] downloaded!");
      this.debug("Landscape with timestamp [" + timestamp + "] downloaded!");
    }).catch((error: any) => {
      AlertifyHandler.closeAlertifyMessages(/* error.text */);
      this.debug("Could not download landscape with timestamp [" + timestamp + "]", error.text);
      throw new Error("Could not download landscape with timestamp [" + timestamp + "]. Enable debugging in console");
    });
  }

  // uploads a landscape from the client to the backend and pushes the response into the store
  uploadLandscape(evt: any) {
    const self = this;

    let { access_token } = get(this.session, 'data.authenticated');

    const file = evt.target.files[0];

    const fileName = file.name;
    const urlPath = `/v1/landscapes/replay/upload?filename=${fileName}`;
    const url = `${ENV.APP.API_ROOT}${urlPath}`;

    const fd = new FormData();
    fd.append('file', file);

    // use dataType: "text" since Ember-Ajax expects a JSON
    // response by default and a simple HTTP 200 response would throw
    // an error
    this.get('ajax').raw(url, {
      method: 'POST',
      data: fd,
      processData: false,
      contentType: false,
      headers: { 'Authorization': `Bearer ${access_token}` },
      dataType: "text"
    }).then((payload: any) => {
      const jsonLandscape = payload.jqXHR.responseText;
      const parsedLandscape = JSON.parse(jsonLandscape);
      self.get('store').push(parsedLandscape);

      AlertifyHandler.showAlertifySuccess("Landscape sucessfully uploaded!");
      this.debug("Landscape sucessfully uploaded!");
    }).catch((error: any) => {
      AlertifyHandler.closeAlertifyMessages(/* error.payload.errors[0].detail */);
      this.debug("Could not upload landscape.", error.payload.errors[0].detail);
      throw new Error("Could not upload landscape. Enable debugging in console");
    });
  }

}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'landscape-file-loader': LandscapeFileLoader;
  }
}