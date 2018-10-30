import Service from '@ember/service';

export default Service.extend({

    showWindow: false,
    data: null,

    toggleWindow(){
        if (this.get('showWindow')){
            this.set('showWindow', false);
        } else {
            this.set('showWindow', true);
        }
    }

});
