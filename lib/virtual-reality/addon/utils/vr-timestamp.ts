
export default class VrTimestampService {

    timestamp: number;

    interval: number;

    constructor({timestamp, interval}: {timestamp: number, interval: number}) {
        this.timestamp = timestamp;
        this.interval = interval;
    }

    updateLandscapeToken(landscapeToken: string, timestamp: number): Promise<void> {
        // TODO implement me
        console.log('update landscape', landscapeToken, timestamp);
        this.timestamp = timestamp;
        return Promise.resolve();
    }

    updateTimestamp(timestamp: number) {
        // TODO implement me
        console.log('update timestamp', timestamp);
        this.timestamp = timestamp;
    }
}