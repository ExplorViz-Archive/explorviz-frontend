import AjaxService from 'ember-ajax/services/ajax';

export default AjaxService.extend({
  trustedHosts: [
    'http://localhost:8080'
  ],

  host: 'http://localhost:8080',

  namespace: '/session/create',
  
  headers: function(){
    let headers = {};
    headers['Content-Type'] = "application/json";
    headers['Accept'] = "application/json";
    return headers;
  }
});
