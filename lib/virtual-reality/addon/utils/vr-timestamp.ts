
export default class VrTimestampService {

    timestamp: number;

    interval: number;

    constructor(timestamp: number, interval: number) {
        this.timestamp = timestamp;
        this.interval = interval;
    }

}