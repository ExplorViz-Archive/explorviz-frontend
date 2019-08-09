import Service, { inject as service } from '@ember/service';
import ENV from 'explorviz-frontend/config/environment';
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';
import AlertifyHandler from 'explorviz-frontend/mixins/alertify-handler';
import debugLogger from 'ember-debug-logger';
import DS from 'ember-data';

/**
 * This Service offers the functionality to download and upload a landscape
 *
 * @class LandscapeFileLoader
 * @extends {Service}
 */
export default class LandscapeFileLoader extends Service.extend(FileSaverMixin, AlertifyHandler) {

  debug = debugLogger();

  @service('session') session !: any;
  @service('store') store !: DS.Store;
  @service('ajax') ajax !: any;

  fileExtension: string = ".json";

  //downloads a landscape from the backend
  downloadLandscape(id: string, timestamp: string, totalRequests: number) {

    const self = this;

    const { access_token } = this.get('session.data.authenticated');

    const urlPath = `/v1/landscapes/${id}/download`;
    const savedFileName = timestamp + "-" + totalRequests + this.get('fileExtension');
    const url = `${ENV.APP.API_ROOT}${urlPath}`

    this.get('ajax').raw(url, {
      'id': this,
      headers: { 'Authorization': `Basic ${access_token}` },
      dataType: 'text',
      options: {
        arraybuffer: true
      }
    }
    ).then((content: any) => {
      this.saveFileAs(savedFileName, content.payload, 'application/json');
      self.showAlertifySuccess("Landscape with id [" + id + "] downloaded!");
      this.debug("Landscape with id [" + id + "] downloaded!");
    }).catch((error: any) => {
      self.showAlertifyError(error.text);
      this.debug("Could not download landscape with id [" + id + "]", error.text);
      throw new Error("Could not download landscape with id [" + id + "]. Enable debugging in console");
    });
  }

  // // uploads a tutorial from the client to the backend and pushes the response into the store
  // uploadTutorial(evt) {

  //   const self = this;

  //   let { access_token } = this.get('session.data.authenticated');

  //   const urlPath = `/v1/tutorials/upload`;
  //   const url = `${ENV.APP.API_ROOT}${urlPath}`;

  //   const file = evt.target.files[0];

  //   const fd = new FormData();
  //   fd.append('file', file);

  //   // use dataType: "text" since Ember-Ajax expects a JSON
  //   // response by default and a simple HTTP 200 response would throw
  //   // an error
  //   this.get('ajax').raw(url, {
  //     method: 'POST',
  //     data: fd,
  //     processData: false,
  //     contentType: false,
  //     headers: { 'Authorization': `Basic ${access_token}` },
  //     dataType: "text"
  //   }).then((payload) => {
  //     const jsonTutorial = payload.jqXHR.responseText;
  //     const parsedTutorial = JSON.parse(jsonTutorial);
  //     self.get('store').push(parsedTutorial);

  //     self.showAlertifySuccess("Tutorial sucessfully uploaded!");
  //     this.debug("Tutorial sucessfully uploaded!");
  //   }).catch((error) => {
  //     self.showAlertifyError(error.payload.errors[0].detail);
  //     this.debug("Could not upload tutorial.", error.payload.errors[0].detail);
  //     throw new Error("Could not upload tutorial. Enable debugging in console");
  //   });
  // }

}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'landscape-file-loader': LandscapeFileLoader;
  }
}