
export default class VrTimestampService {

    timestamp: number;

    interval: number;

    constructor({timestamp, interval}: {timestamp: number, interval: number}) {
        this.timestamp = timestamp;
        this.interval = interval;
    }

}