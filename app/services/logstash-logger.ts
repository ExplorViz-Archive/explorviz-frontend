import Service from '@ember/service';
import debugLogger from 'ember-debug-logger';
import $ from 'jquery';

// https://blog.emberjs.com/2019/01/26/emberjs-native-class-update-2019-edition.html

export default class LogstashLogger extends Service {

  private _logstashEndpoint: string = "http://localhost:4563/"
  private _logstashEnabled: boolean = false


  init() {
    this._logstashEndpoint = ""
    this._logstashEnabled = true
  }

  set logstashEnabled(enabled: boolean) {
    this._logstashEnabled = enabled;
  }

  get logstashEnabled(): boolean {
    return this._logstashEnabled;
  }

  log(name: string, message: string):void {
    if (this._logstashEnabled) {
      this.forward(name, message);
    }

    let logger = debugLogger(name);
    logger(message)
  }
  
  private forward(name: string, message: string): void {
    console.log("Forwarding to Logstash")
    let logObj = {
      'name': name,
      'message': message
    }

    $.ajax("http://localhost:4563", { 
      type: "POST",
      data: JSON.stringify(logObj),
      mimeType: "json",
      error: function (ajaxContext) {
        let debug = debugLogger("LogstashLogger");
        let statuscode = ajaxContext.status;
        let statustext = ajaxContext.statusText;
        debug(`Failed to forward logs to Logstash: ${statuscode} - ${statustext}`)
      }
    })
  }
  
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'logstash': LogstashLogger;
  }
}
