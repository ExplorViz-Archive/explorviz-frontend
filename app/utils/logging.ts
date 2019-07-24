import debugLogger from 'ember-debug-logger';
import $ from 'jquery';

abstract class Logger {

    protected _name: string;

    constructor(name: string) {
        this._name = name;
    }

    log(level: LogLevel, message: String): void {
        switch(level) {
            case LogLevel.DEBUG:
                this.debug(message); 
                break;
            case LogLevel.INFO:
                this.info(message);
                break;
            case LogLevel.WARN:
                this.warn(message);
                break;
            case LogLevel.ERROR:
                this.error(message);
                break;
        }
    }

    abstract debug(message: String): void;
    abstract info(message: String): void;
    abstract warn(message: String): void;
    abstract error(message: String): void;
}

class LogstashPayload {
    constructor(public name: string, public levelName: string, public levelCode: number, public message: string, public time: number){}
}

class LogstashLogger extends Logger {

    private _logstashEndpoint: string = "http://localhost:4563/"


    constructor(name: string) {
        super(name);
    }

    private dispatch(msg: LogstashPayload): void {
        $.ajax(this._logstashEndpoint, { 
            type: "POST",
            data: JSON.stringify(msg),
            mimeType: "json"
          })
    }

    debug(message: string): void {
        let lvlName = LogLevel[LogLevel.DEBUG]
        let now = new Date().getDate();
        let msg = new LogstashPayload(this._name, lvlName, LogLevel.DEBUG, message, now);
        this.dispatch(msg)
    }

    info(message: string): void {
        let lvlName = LogLevel[LogLevel.INFO]
        let now = new Date().getDate();
        let msg = new LogstashPayload(this._name, lvlName, LogLevel.INFO, message, now);
        this.dispatch(msg)
    }

    warn(message: string): void {
        let lvlName = LogLevel[LogLevel.WARN]
        let now = new Date().getDate();
        let msg = new LogstashPayload(this._name, lvlName, LogLevel.WARN, message, now);
        this.dispatch(msg)
    }

    error(message: string): void {
        let lvlName = LogLevel[LogLevel.ERROR]
        let now = new Date().getDate();
        let msg = new LogstashPayload(this._name, lvlName, LogLevel.ERROR, message, now);
        this.dispatch(msg)
    }     
}

class DebugLogger extends Logger {

    private _debug: any;

    constructor(name: string) {
        super(name)
        this._debug = debugLogger(name);
    }

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

    
    log(level: LogLevel, message: String): void {
        let lvlName = LogLevel[level];
        this._debug("["+lvlName+"] " + message);
    }
    
}

interface ConstructorOf<T> {
    new(...args: any[]): T
}

class CompositLogger extends Logger {
    private loggers: Logger[];

    constructor(name: string) {
        super(name)
        this.loggers = [];
    }
    addLogger<T extends Logger>(loggerCls : ConstructorOf<T>): void {
        let logger = new loggerCls(this._name);
        this.loggers.push(logger);
    }

    debug(message: String): void {
        this.loggers.forEach(l => {
            l.debug(message);
        });
    }    
    info(message: String): void {
        this.loggers.forEach(l => {
            l.info(message);
        });
    }
    warn(message: String): void {
        this.loggers.forEach(l => {
            l.warn(message);
        });
    }
    error(message: String): void {
        this.loggers.forEach(l => {
            l.error(message);
        });
    }    
}

enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

const logstashEnabled = true;

export default function logger(name: string): Logger{
    let l = new CompositLogger(name);
    
    if (logstashEnabled) {
        l.addLogger(LogstashLogger);
    }

    l.addLogger(DebugLogger);

    return l;
}