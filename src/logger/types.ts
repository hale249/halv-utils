export interface LoggerContext {
  logger: LoggerInstance;
  level: string;
  transports: Array<Logger>;
}

export interface LogFn {
  (...args: Array<unknown>): void;
}

export interface Logger {
  level?: string;
  setLevel(level: string): void;
  error: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
}

export interface LoggerInstance extends Logger {
  level: string;
  transports: Array<Logger>;
  addTransport(logger: Logger): void;
  _context: LoggerContext;
}

export interface LoggerConfig {
  level?: string;
  transports?: Array<Logger>;
}
