export type Timeout = ReturnType<typeof setTimeout>;

/**
 * Debounce
 * @param fn
 * @param delay
 * @param immediate
 */
export const debounce = (fn: any, delay = 0, immediate = false) => {
  let timeout: null | Timeout = null;
  return (...args: any) => {
    if (immediate && !timeout) {
      fn(...args);
    }

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const throttle = (fn: any, limit: number) => {
  let wait = false;
  let timeout: null | Timeout = null;
  return (...args: any) => {
    if (!wait) {
      fn(...args);
      wait = true;
      timeout = setTimeout(() => {
        wait = false;
        if (timeout) {
          clearTimeout(timeout);
        }
      }, limit);
    }
  };
};
