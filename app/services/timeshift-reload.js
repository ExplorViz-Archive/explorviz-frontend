import Reload from './data-reload';

export default Reload.extend({
	object: null,
	/*
		this service starts working with the application. Look "instance-initializer/service-start" for more information
	*/
	//@override
	updateObject(){
		const self = this;

		if(this.get('previousRequestDone')) {
			this.set('previousRequestDone', false);
			this.debug("start request");
			var timestampstorage = this.get("store").queryRecord('timestampstorage', '1');
			timestampstorage.then(success, failure).catch(error);
		}

	
	
		//----------------------------- Start of inner functions of getData------------------------------------------
		function success(timestampstorage){
			const timestamps = timestampstorage.get('timestamps');
			const sortedTimestamps = timestamps.sortBy('timestamp');

			// define outside loop in case of error
			var timestampList = [];
			var timestampListFormatted = [];
			var callList = [];

			// Parse and format timestamps for timeline
			if (sortedTimestamps) {
				sortedTimestamps.forEach(function(timestamp) {
				const timestampValue = timestamp.get('timestamp');
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
	
		function failure(){
			self.set('previousRequestDone', true);
			console.log("timestamp couldn`t be requested");
		}
		
		function error(e){
			self.set('previousRequestDone', true);
			console.log(e);
		}
		
		
		//-------------------------------------------------end of inner functions of getData--------------------------------
	
	}
	
	
});
