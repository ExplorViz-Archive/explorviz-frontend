import Component from '@ember/component';
import { inject as service } from "@ember/service";

export default Component.extend({

  // No Ember generated container
  tagName: '',

  ajax: service(),
  session: service(),

  // pass via template
  backendURL: null,

  actions: {

    triggerSelectBox() {
      document.querySelector("#selectBox").click();
    },

    //upload file from client to backend server
    uploadFile(evt) {
      const file = evt.target.files[0];
      let { access_token } = this.get('session.data.authenticated');

      const fd = new FormData();    
      fd.append('file', file);

      // use dataType: "text" since Ember-Ajax expects a JSON 
      // response by default and a simple HTTP 200 response would throw 
      // an error

      this.get('ajax').raw(this.get('backendURL'), {
        method: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        headers: { 'Authorization': `Basic ${access_token}` },
        dataType: "text"
      });
    }
  }
});
