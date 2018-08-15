import Service from '@ember/service';

export default Service.extend({

  // https://github.com/segmentio/sse/blob/master/index.js

  content: null,

  init() {

    this._super(...arguments);
    this.set('content', []);

    const self = this;   

    let unbind = self.subscribe('/updates', (data)=>{
      if (data == 'quit') {
        unbind();
      }
      self.get('content').unshiftObject(data);
    });
  },

  subscribe(url, fn){

    const self = this;   

    let source = new EventSource(url);
    source.onmessage = function(e){
      fn(e.data);
    };
    source.onerror = function(e){
      if (source.readyState == EventSource.CLOSED) return;
      self.error(e);
    };
    return source.close.bind(source);
  }

});
