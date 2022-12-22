import { extend } from '../object';
import { LoggerInstance, Logger, LoggerConfig, LoggerContext } from './types';

export enum LogLevels {
  none = 'none',
  error = 'error',
  warn = 'warn',
  info = 'info',
  debug = 'debug',
}
export const levels = [
  LogLevels.none.toString(),
  LogLevels.error.toString(),
  LogLevels.warn.toString(),
  LogLevels.info.toString(),
  LogLevels.debug.toString(),
];

/**
 * Check should show log by level
 * No logs with a level lower than the one provided to the config will be accepted.
 * @param configLevel
 * @param level
 */
function shouldLog(configLevel: string, level: string): boolean {
  return levels.indexOf(level) <= levels.indexOf(configLevel);
}

/**
 * Create logger context
 */
function createLoggerContext(): LoggerContext {
  return {
    logger: null as any,
    level: 'none',
    transports: [],
  };
}

/**
 * Handle log
 * @param context
 * @param level
 * @param args
 */
function handleLog(context: LoggerContext, level: string, ...args: Array<unknown>): void {
  context.transports.forEach(transport => {
    const configLevel = transport.level || context.level;

    if (!shouldLog(configLevel, level)) {
      return;
    }

    try {
      switch (level) {
        case LogLevels.error: {
          transport.error(...args);
          break;
        }
        case LogLevels.warn: {
          transport.warn(...args);
          break;
        }
        case LogLevels.info: {
          transport.info(...args);
          break;
        }
        case LogLevels.debug: {
          transport.debug(...args);
          break;
        }
      }
    } catch (error) {
      console.error('Logger handleLog error: ', error);
    }
  });
}

/**
 * Create logger
 * @param config
 */
export function createLogger(config?: LoggerConfig): LoggerInstance {
  let context = createLoggerContext();

  if (config) {
    context = extend(context, config);
  }

  return (context.logger = {
    level: context.level,
    transports: context.transports,
    setLevel(level: string): void {
      context.level = level;
    },
    addTransport(logger: Logger) {
      context.transports.push(logger);
    },
    error(...args: Array<unknown>): void {
      handleLog(context, LogLevels.error, ...args);
    },
    warn(...args: Array<unknown>): void {
      handleLog(context, LogLevels.warn, ...args);
    },
    info(...args: Array<unknown>): void {
      handleLog(context, LogLevels.info, ...args);
    },
    debug(...args: Array<unknown>): void {
      handleLog(context, LogLevels.debug, ...args);
    },
    _context: context,
  });
}
