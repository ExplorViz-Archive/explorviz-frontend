import debugLogger from 'ember-debug-logger';
import $ from 'jquery';

abstract class Logger {

    protected name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract log(level: LogLevel, message: String): void;

    debug(message: String): void {
        this.log(LogLevel.DEBUG, message);
    }    
    info(message: String): void {
        this.log(LogLevel.INFO, message);
    }
    warn(message: String): void {
        this.log(LogLevel.WARN, message);
    }
    error(message: String): void {
        this.log(LogLevel.ERROR, message);
    }
}

class LogstashEvent {
    constructor(public name: string, 
        public level: string,
        public message: string, 
        public time: number){}
}

class LogstashLogger extends Logger {

    log(level: LogLevel, message: string): void {
        let lvlName = LogLevel[level]
        let now = new Date().getDate();
        let event = new LogstashEvent(this.name, lvlName, message, now);
        this.dispatch(event);
    }

    private logstashURL: string = "http://localhost:4563/"


    constructor(name: string) {
        super(name);
    }

    private dispatch(event: LogstashEvent): void {
        $.ajax(this.logstashURL, { 
            type: "POST",
            data: JSON.stringify(event),
            mimeType: "json"
          })
    }
    
}

class DebugLogger extends Logger {

    private _debug: any;

    constructor(name: string) {
        super(name)
        this._debug = debugLogger(name);
    }

   

    
    log(level: LogLevel, message: String): void {
        let lvlName = LogLevel[level];
        this._debug("["+lvlName+"] " + message);
    }
    
}

interface ConstructorOf<T> {
    new(...args: any[]): T
}

class CompositLogger extends Logger {

    log(level: LogLevel, message: String): void {
        this.loggers.forEach((l) => l.log(level, message))
    }
    private loggers: Logger[];

    constructor(name: string) {
        super(name)
        this.loggers = [];
    }

    addLogger<T extends Logger>(loggerCls : ConstructorOf<T>): void {
        let logger = new loggerCls(this.name);
        this.loggers.push(logger);
    }

}

enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

// Configuration
const logstashEnabled = true;

export default function logger(name: string): Logger{
    let l = new CompositLogger(name);
    
    if (logstashEnabled) {
        l.addLogger(LogstashLogger);
    }

    l.addLogger(DebugLogger);

    return l;
}