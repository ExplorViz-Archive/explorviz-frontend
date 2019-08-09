import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({

  // No Ember generated container
  tagName: '',

  // default time units
  responseTimeUnit: 'ms',

  landscapeRepo: service("repos/landscape-repository"),
  additionalData: service('additional-data'),
  store: service(),

  isSortedAsc: true,
  sortBy: 'timestamp',
  filterTerm: '',
  selectedQuery: null,
  scrollPosition: null,

  // Compute current traces when highlighting changes
  databaseQueries: computed('landscapeRepo.latestApplication.databaseQueries', 'isSortedAsc', 'sortBy',
    'filterTerm', 'selectedQuery', function () {

      let queries;
      if (this.get('selectedQuery')) {
        queries = [this.get('selectedQuery')];
      } else {
        queries = this.filterAndSortQueries(this.get('landscapeRepo.latestApplication.databaseQueries'));
      }
      return queries;
    }),

  filterAndSortQueries(queries) {
    if (!queries) {
      return [];
    }

    let filteredQueries = [];
    let filter = this.get('filterTerm');
    queries.forEach((query) => {
      if (filter === ''
        || query.get('sqlStatement').toLowerCase().includes(filter)) {
        filteredQueries.push(query);
      }
    });

    if (this.get('isSortedAsc')) {
      filteredQueries.sort((a, b) => (a.get(this.get('sortBy')) > b.get(this.get('sortBy'))) ? 1 : ((b.get(this.get('sortBy')) > a.get(this.get('sortBy'))) ? -1 : 0));
    } else {
      filteredQueries.sort((a, b) => (a.get(this.get('sortBy')) < b.get(this.get('sortBy'))) ? 1 : ((b.get(this.get('sortBy')) < a.get(this.get('sortBy'))) ? -1 : 0));
    }

    return filteredQueries;
  },

  actions: {
    queryClicked(query) {
      // Allow deselection of query
      if (query.get('isSelected')) {
        query.set('isSelected', false);
        this.set('selectedQuery', null);
        if (this.get('scrollPosition')) {
          $('#sqlScrollDiv').animate({ scrollTop: this.get('scrollPosition') }, 'slow');
        }
      }
      // Select query
      else {
        // Deselect potentially selected query
        let queries = this.get('store').peekAll('databasequery');
        queries.forEach((query) => {
          query.set('isSelected', false);
        });
        // Mark new query as selected
        query.set('isSelected', true);
        this.set('selectedQuery', query);
        // Remember scroll position
        let scrollPos = $('#sqlScrollDiv').scrollTop();
        this.set('scrollPosition', scrollPos);
      }
    },

    filter() {
      // Case insensitive string filter
      this.set('filterTerm', this.get('filterInput').toLowerCase());
    },

    toggleResponseTimeUnit() {
      let timeUnit = this.get('responseTimeUnit');

      if (timeUnit === 'ns') {
        this.set('responseTimeUnit', 'ms');
      }
      else if (timeUnit === 'ms') {
        this.set('responseTimeUnit', 's');
      }
      else if (timeUnit === 's') {
        this.set('responseTimeUnit', 'ns');
      }
    },

    sortBy(property) {
      // Determine order for sorting
      if (this.get('sortBy') === property) {
        // Toggle sorting order
        this.set('isSortedAsc', !this.get('isSortedAsc'));
      } else {
        // Sort in ascending order by default
        this.set('isSortedAsc', true);
      }

      // Set property by which shall be sorted
      this.set('sortBy', property);
    },

    close() {
      this.get('additionalData').removeComponent("visualization/page-setup/sidebar/sql-viewer");
    },
  },

});
