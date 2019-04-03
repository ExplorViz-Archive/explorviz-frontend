import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';

export default Component.extend({

  // No Ember generated container
  tagName: '',

  traceTimeUnit: 'ms',
  traceStepTimeUnit: 'ms',
  sortBy: 'traceId',
  sortOrder: 'asc',
  filterTerm: '',

  additionalData: service('additional-data'),
  highlighter: service('visualization/application/highlighter'),
  landscapeRepo: service('repos/landscape-repository'),
  renderingService: service(),

  // Compute current traces when highlighting changes
  traces: computed('highlighter.highlightedEntity', 'landscapeRepo.latestApplication', 'sortBy', 'sortOrder', 'filterTerm' , function () {
    let highlighter = this.get('highlighter');
    if (highlighter.get('isTrace')) {
      return [highlighter.get('highlightedEntity')];
    } else {
      return this.filterAndSortTraces(this.get('landscapeRepo.latestApplication.traces'));
    }
  }),

  filterAndSortTraces(traces){
    let filteredTraces = [];
    let filter = this.get('filterTerm');
    traces.forEach( (trace) => {
      if (filter === '' 
      || trace.get('traceId').includes(filter) 
      || trace.get('sourceClazz.name').toLowerCase().includes(filter) 
      || trace.get('targetClazz.name').toLowerCase().includes(filter)){
        filteredTraces.push(trace);
      }
    });

    if (this.get('sortOrder') === 'asc'){
      filteredTraces.sort((a,b) => (a.get(this.get('sortBy')) > b.get(this.get('sortBy'))) ? 1 : ((b.get(this.get('sortBy')) > a.get(this.get('sortBy'))) ? -1 : 0)); 
    } else {
      filteredTraces.sort((a,b) => (a.get(this.get('sortBy')) < b.get(this.get('sortBy'))) ? 1 : ((b.get(this.get('sortBy')) < a.get(this.get('sortBy'))) ? -1 : 0)); 
    }

    return filteredTraces;
  },

  init() {
    this.get('additionalData').on('showWindow', this, this.onWindowChange);
    this._super(...arguments);
  },

  actions: {
    clickedTrace(trace) {
      if (trace.get('highlighted')){
        this.get('highlighter').unhighlightAll();
      } else {
        this.get('highlighter').highlightTrace(trace);
      }

      this.get('renderingService').redrawScene();
    },

    filter(){
      // Case insensitive string filter
      this.set('filterTerm', this.get('filterInput').toLowerCase());
    },

    selectNextTraceStep() {
      this.get('highlighter').highlightNextTraceStep();
      this.get('renderingService').redrawScene();
      let currentTraceStep = this.get('highlighter.currentTraceStep');
      let originClazz = currentTraceStep.get('clazzCommunication.sourceClazz');
      let position = new THREE.Vector3(originClazz.get('positionX'), originClazz.get('positionY'), originClazz.get('positionZ'));
      this.get('renderingService').moveCamera(position);
    },

    selectPreviousTraceStep() {
      this.get('highlighter').highlightPreviousTraceStep();
      this.get('renderingService').redrawScene();
      let currentTraceStep = this.get('highlighter.currentTraceStep');
      let originClazz = currentTraceStep.get('clazzCommunication.sourceClazz');
      let position = new THREE.Vector3(originClazz.get('positionX'), originClazz.get('positionY'), originClazz.get('positionZ'));
      this.get('renderingService').moveCamera(position);
    },

    toggleTraceTimeUnit() {
      let timeUnit = this.get('traceTimeUnit');
      if (timeUnit === 'ms'){
        this.set('traceTimeUnit', 's');
      } else if (timeUnit === 's'){
        this.set('traceTimeUnit', 'ms');
      }
    },

    toggleTraceStepTimeUnit() {
      let timeUnit = this.get('traceStepTimeUnit');
      if (timeUnit === 'ms'){
        this.set('traceStepTimeUnit', 's');
      } else if (timeUnit === 's'){
        this.set('traceStepTimeUnit', 'ms');
      }
    },

    sortBy(property){
      // Determine order for sorting
      if (this.get('sortBy') === property){
        // Toggle sorting order
        if (this.get('sortOrder') === 'asc'){
          this.set('sortOrder', 'desc');
        } else {
          this.set('sortOrder', 'asc');
        }
      } else {
        // Sort in ascending order by default
        this.set('sortOrder', 'asc');
      }

      // Set property by which shall be sorted
      this.set('sortBy', property);
    },

    close() {
      this.get('additionalData').removeComponent("visualization/page-setup/sidebar/trace-selection");
    },
  },

  onWindowChange() {
    if (!this.get('additionalData.showWindow') && this.get('highlighter.isTrace')) {
      let highlighter = this.get('highlighter');
      highlighter.unhighlightAll();
      this.get('renderingService').redrawScene();
    }
  },

});
