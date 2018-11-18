import Service from '@ember/service';

export default Service.extend({

    showWindow: false,
    shownComponents: null,
    data: null,

    addComponent(path){
        if(!this.get('shownComponents'))
            this.shownComponents = [];

        if (!this.get('shownComponents').includes(path)){
            this.get('shownComponents').push(path);
        }
    },

    removeComponent(path){
        if(!this.get('shownComponents'))
            return;

        var index = this.get('shownComponents').indexOf(path);
        if (index !== -1) 
            this.get('shownComponents').splice(index, 1);

        // close everything when no components are left
        if (this.get('shownComponents.length') == 0)
            this.emptyAdditionalData()
    },

    emptyAdditionalData(){
        this.set('showWindow', false);
        this.set('shownComponents', []);
        this.set('data', null);
    }

});
