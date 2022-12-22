import { StorageGetOptions } from './types';
import { NOOP } from './function';

/**
 * Parse to json
 * @param value
 * @param defaultValue
 * @return {{}}
 */
export const parseToJson = (value: string, defaultValue = {}) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return defaultValue;
  }
};

/**
 * Read and parse value
 * @param value
 * @param options
 */
export function parseStorageValue(value: string | null, options?: StorageGetOptions): any {
  try {
    if ((options && options.doNotParse) || !value) {
      return value;
    }

    return JSON.parse(value);
  } catch (err) {
    NOOP();
  }

  return value;
}
