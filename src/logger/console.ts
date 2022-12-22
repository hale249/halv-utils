import { Logger } from './types';

export const Console: Logger = {
  level: '',
  setLevel(level): void {
    Console.level = level;
  },
  error(msg, ...args): void {
    console.log('[SB][error]', msg, ...args);
  },
  warn(msg, ...args): void {
    console.log('[SB][warn]', msg, ...args);
  },
  info(msg, ...args): void {
    console.log('[SB][info]', msg, ...args);
  },
  debug(msg, ...args): void {
    console.log('[SB][debug]', msg, ...args);
  },
};
