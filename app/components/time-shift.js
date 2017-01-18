import Ember from 'ember';

const {Component, $, on, observer} = Ember;

export default Component.extend({

  store: Ember.inject.service(),
  plot: null,

  init() {
    this._super(...arguments);

    $(window).resize(() => {
      this.resizePlot();
  });
  },

  getTimestamps: function () {
    var store = this.get('store');
    // GET /show-timestamps
    var timestampstorage = store.findAll('timestampstorage');
    console.log(timestampstorage);
    // no network request
    //var timestamps = timestampstorage.get('timestamp');

    //return timestamps;
    //console.log(timestamps);
  },

  renderPlot: on('didRender', observer('', function () {

    var winWidth = $(window).width();
    Ember.$("#timeline").css('width', winWidth);

    // Needed to fix the height of the plot
    Ember.$("#timelinePlot").css('width', $("#timeline").width());
    Ember.$("#timelinePlot").css('height', $("#timeline").height());

    //var timestamps = this.getTimestamps();
    this.getTimestamps();
    //console.log(timestamps);

    var ctx = $("#timelinePlot");
    var config = {
      type: 'line',
      data: {
        labels: ['15:42:00', '15:42:30', '15:43:00', '15:43:30', '15:44:00'],
        datasets: [{
          label: '# of Calls',
          data: [0, 2000, 5000, 3000, 1000, 0],
          backgroundColor: 'rgba(0, 80, 255, 0.2)',
          borderColor: 'rgba(0, 80, 255, 0.8)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "# of Calls"
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },

        pan: {
          enabled: true,
          // Panning directions. Remove the appropriate direction to disable
          // Eg. 'y' would only allow panning in the y direction
          mode: 'xy',
          speed: 10,
          threshold: 10
        },
        zoom: {
          enabled: true,
          drag: true,
          // Zooming directions. Remove the appropriate direction to disable
          // Eg. 'y' would only allow zooming in the y direction
          mode: 'xy',
          limits: {
            max: 5000,
            min: 0
          }
        }
      }
    };

    var newPlot = new Chart(ctx, config);
    this.set('plot', newPlot);
  })),

  resizePlot: function () {
    this.renderPlot();
  },

  actions: {
    toggleTimeline() {

      if ($(".timeline").attr('vis') === 'show') {
        $(".timeline").slideUp();
        $("#vizContainer").animate({height:'+=200'});
        $(".timeline").attr('vis', 'hide');
      }
      else {
        $(".timeline").slideDown();
        $("#vizContainer").animate({height:'-=200'});
        $(".timeline").attr('vis', 'show');

      }
    }
  }

});
