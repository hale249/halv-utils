/**
 * 'next' function, passed to a middleware
 */
export type NextFunction = () => void | Promise<void>;

/**
 * A middleware
 */
export type Middleware<T> = (context: T, next: NextFunction) => Promise<void> | void;

export interface MiddlewarePipeline<T> {
  unshift: (middleware: Middleware<T>) => void;
  use: (middleware: Middleware<T>) => void;
  execute: (context: T) => Promise<void>;
}

export const createMiddlewarePipeline = <T>(): MiddlewarePipeline<T> => {
  const middlewares: Array<Middleware<T>> = [];

  /**
   * Add a middleware function at the end of middlewares array
   */
  const use = (middleware: Middleware<T>) => {
    middlewares.push(middleware);
  };

  /**
   * Add a middleware function at the beginning of middlewares array
   */
  const unshift = (middleware: Middleware<T>) => {
    middlewares.unshift(middleware);
  };

  /**
   * Helper function for invoking a chain of middlewares.
   */
  const invokeMiddlewares = async <T>(context: T, middlewares: Array<Middleware<T>>): Promise<void> => {
    if (!middlewares.length) {
      return;
    }

    const middleware = middlewares[0];

    return middleware(context, async () => {
      await invokeMiddlewares(context, middlewares.slice(1));
    });
  };

  /**
   * Execute the chain of middlewares, in the order they were added.
   */
  const execute = (context: T): Promise<void> => {
    return invokeMiddlewares(context, middlewares);
  };

  return {
    unshift,
    use,
    execute,
  };
};
