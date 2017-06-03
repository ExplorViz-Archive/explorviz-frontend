import Reload from './data-reload';
import Ember from "ember";
import moment from 'npm:moment';

export default Reload.extend({
	object: null,
	//@override
	shallReload: true,
	/*
		this service starts working with the application. Look "instance-initializer/service-start" for more information
	*/
	//@override
	updateObject(){
		const self = this;

		if(this.get('previousRequestDone')) {
			this.set('previousRequestDone', false);
			this.debug("start request");
			var timestamps = this.get("store").query('timestamp', '1');
			timestamps.then(success, failure).catch(error);
		}

	
	
		//----------------------------- Start of inner functions of updateObject------------------------------------------
		function success(timestamps){
			const sortedTimestamps = timestamps.sortBy('id');
			// define outside loop in case of error
			var timestampList = [];
			var timestampListFormatted = [];
			var callList = [];

			// Parse and format timestamps for timeline
			if (sortedTimestamps) {
				sortedTimestamps.forEach(function(timestamp) {
					
					self.get("store").push(timestamp.serialize({includeId: true})); 
					const timestampValue = timestamp.get('id');
					timestampList.push(timestampValue);

					const callValue = timestamp.get('calls');
					callList.push(callValue);

					const parsedTimestampValue = moment(timestampValue,"x");
					const timestampValueFormatted = parsedTimestampValue.format("HH:mm:ss").toString();
					timestampListFormatted.push(timestampValueFormatted);
				});
			}

			// maximum number of timestamps displayed in chart at one time
			const maxNumOfChartTimestamps = 30;

			// TODO: error handling (no data etc)

			// Container for charts (limited size)
			var chartTimestamps = [];
			var chartCalls = [];
			const timestampListFormattedSize = timestampListFormatted.length;

			// limit size of displayed data points and labels
			if (timestampListFormattedSize > maxNumOfChartTimestamps) {
				chartTimestamps = timestampListFormatted.slice(timestampListFormattedSize-maxNumOfChartTimestamps,timestampListFormattedSize);
				chartCalls = callList.slice(timestampListFormattedSize-maxNumOfChartTimestamps,timestampListFormattedSize);
			}
			else {
				chartTimestamps = timestampListFormatted;
				chartCalls = callList;
			}

			// get maximum amount of call for scaling the chart
			const maxCalls = Math.max.apply(null, chartCalls);
			const chartData = {
				labels: chartTimestamps,
				values: chartCalls,
				maxValue: maxCalls
			};
			
			//This will set the object
			self.set("object", chartData);
			self.debug("end request");
			self.set('previousRequestDone', true);
		}
	
		function failure(e){
			self.set('previousRequestDone', true);
			console.error(e.message);
		}
		
		function error(e){
			self.set('previousRequestDone', true);
			console.error(e);
		}
		
		
		//-------------------------------------------------end of inner functions of getData--------------------------------
	
	},
	
	//@override
	reloadObjects(){
		const self = this;
		var timestamps = this.get("store").peekAll("timestamp").sortBy("id");
		var oldestTimestamp = timestamps.get("firstObject");
		
		if(!oldestTimestamp){
			this.set("reloadThread", Ember.run.later(this, function(){this.set("shallReload", true);}, 1000));      //if there is no Object, the service shall wait for a second, then reload
			return;
		}
		var id = oldestTimestamp.get("id");
		var requestedTimestamps = this.get("store").query('timestamp', id);
			requestedTimestamps.then(success, failure).catch(error);
			
		function success(timestamps){
			var length = timestamps.get("length");
			if(length !== 0){
				timestamps.forEach(function(timestamp){
					self.get("store").push(timestamp.serialize({includeId:true}));
				});
				self.set("shallReload", true);
			}
		}
		
		function failure(e){
			console.error(e.message);
		}
		
		function error(e){
			console.error(e);
		}
	},
	
	
});
