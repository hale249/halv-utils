import fetch from 'isomorphic-fetch';
import { extend } from '../object';

const retryStatusCodes = new Set([
  408, // Request Timeout
  409, // Conflict
  425, // Too Early
  429, // Too Many Requests
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, //  Gateway Timeout
]);

const payloadMethods = new Set(Object.freeze(['PATCH', 'POST', 'PUT', 'DELETE']));

/**
 * Check is payload method
 * @param method
 */
export function isPayloadMethod(method = 'GET'): boolean {
  return payloadMethods.has(method.toUpperCase());
}

/**
 * Http Interceptor
 */
export interface HttpInterceptor<V, T> {
  /**
   * Add a new interceptor to the stack
   * @param onFulfilled
   * @param onRejected
   */
  use(onFulfilled?: (value: V) => V | Promise<V>, onRejected?: (error: T) => T): number;

  /**
   * Remove an interceptor from the stack
   * @param id
   */
  eject(id: number): boolean;
}

export interface HttpInterceptorHandler<V, T> {
  fulfilled?(value: V): V | Promise<V>;
  rejected?(error: T): T | Promise<T>;
}

export interface HttpConfig {
  endpoint: string;
  debug?: boolean;
}

export interface HttpContext {
  http: Http;
  config: HttpConfig;
  interceptors: {
    request: Array<HttpInterceptorHandler<HttpRequestOptions, HttpError>>;
    response: Array<HttpInterceptorHandler<HttpResponse, HttpError>>;
  };
}

export interface HttpRequestOptions {
  method?: string;
  body?: any;
  url?: string;
  headers?: any;
  responseType?: string;
  credentials?: RequestCredentials;
  retry?: number | false;
  signal?: AbortSignal;
  timeout?: number | 0;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers?: any;
  ok: boolean;
}

export interface HttpError<T = any> {
  name: string;
  message: string;
  response?: HttpResponse<T>;
}

export interface Http {
  config: HttpConfig;
  interceptors: {
    request: HttpInterceptor<HttpRequestOptions, HttpError>;
    response: HttpInterceptor<HttpResponse, HttpError>;
  };
  request<T, R = HttpResponse<T>>(url: string, options?: HttpRequestOptions): Promise<R>;
  get<T, R = HttpResponse<T>>(url: string, options?: HttpRequestOptions): Promise<R>;
  post<T, R = HttpResponse<T>>(url: string, options?: HttpRequestOptions): Promise<R>;
  put<T, R = HttpResponse<T>>(url: string, options?: HttpRequestOptions): Promise<R>;
  delete<T, R = HttpResponse<T>>(url: string, options?: HttpRequestOptions): Promise<R>;
  patch<T, R = HttpResponse<T>>(url: string, options?: HttpRequestOptions): Promise<R>;
  readonly _context: HttpContext;
}

export enum HttpMethods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
  Patch = 'PATCH',
}

/**
 * Create interceptor
 * @param handlers
 */
const createInterceptor = function <V, T>(handlers: Array<HttpInterceptorHandler<V, T>>): HttpInterceptor<V, T> {
  return {
    use(onFulfilled?: (value: V) => V | Promise<V>, onRejected?: (error: T) => T): number {
      handlers.push({
        fulfilled: onFulfilled,
        rejected: onRejected,
      });
      return handlers.length - 1;
    },
    eject(id: number): boolean {
      if (typeof handlers[id] !== 'undefined') {
        handlers.splice(id, 1);
        return true;
      }

      return false;
    },
  };
};

/**
 * Create default http content
 */
export function createHttpContext(): HttpContext {
  return {
    http: null as never,
    config: {
      endpoint: '',
    },
    interceptors: {
      request: [],
      response: [],
    },
  };
}

/**
 * Check body stream
 * @param body
 */
export function isStream(body: any): boolean {
  return (
    (typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer) ||
    (typeof FormData !== 'undefined' && body instanceof FormData)
  );
}

/**
 * Initial request options
 * @param options
 */
export function initialRequest(options: HttpRequestOptions = {}): HttpRequestOptions {
  const init: HttpRequestOptions = {
    method: options.method,
    headers: options.headers || {},
    url: options.url,
    signal: options.signal,
    timeout: options.timeout || 0,
  };

  if ((!options.body || !isStream(options.body)) && !init.headers['content-type']) {
    init.headers['content-type'] = 'application/json';
  }

  if (options.body) {
    init.body = isStream(options.body) ? options.body : JSON.stringify(options.body);
  }

  return init;
}

/**
 * Parse request response
 * @param response
 * @param responseType
 */
async function parseResponse<T>(response: Response, responseType: string): Promise<T> {
  let data;

  if (response.ok) {
    switch (responseType.toLowerCase()) {
      case 'json':
        data = await response.json();
        break;
      case 'text':
        data = await response.text();
        break;
      case 'blob':
        data = await response.blob();
        break;
    }
  } else {
    try {
      data = await response.json();
    } catch (_) {
      data = undefined;
    }
  }

  return data;
}

/**
 * Handle error
 * @param err
 */
function handleError(err: HttpError): HttpError {
  return {
    name: err.name,
    message: err.message,
    response: err.response,
  };
}

/**
 * Utility for simple HTTP calls
 */
export function createHttp(config?: HttpConfig): Http {
  const context = createHttpContext();
  if (config) {
    context.config = extend(context.config, config);
  }

  const http: Http = (context.http = {
    interceptors: {
      request: createInterceptor<HttpRequestOptions, HttpError>(context.interceptors.request),
      response: createInterceptor<HttpResponse, HttpError>(context.interceptors.response),
    },
    /**
     * Make an http GET request
     * @param {string} url - url to call
     * @param {HttpRequestOptions} options
     * @returns {Promise}
     */
    get<T>(url: string, options: HttpRequestOptions = {}): Promise<T> {
      return http.request(url, { ...options, method: HttpMethods.Get });
    },

    /**
     * Make an http POST request
     * @param {string} url - url to call
     * @param {HttpRequestOptions} options
     * @returns {Promise}
     */
    post<T>(url: string, options: HttpRequestOptions = {}): Promise<T> {
      return http.request(url, { ...options, method: HttpMethods.Post });
    },

    /**
     * Make an http PUT request
     * @param {string} url - url to call
     * @param {HttpRequestOptions} options
     * @returns {Promise}
     */
    put<T>(url: string, options: HttpRequestOptions = {}): Promise<T> {
      return http.request(url, { ...options, method: HttpMethods.Put });
    },

    /**
     * Make an http DELETE request
     * @param {string} url - url to call
     * @param {HttpRequestOptions} options
     * @returns {Promise}
     */
    delete<T>(url: string, options: HttpRequestOptions = {}): Promise<T> {
      return http.request(url, { ...options, method: HttpMethods.Delete });
    },

    /**
     * Make an http PATCH request
     * @param {string} url - url to call
     * @param {HttpRequestOptions} options
     * @returns {Promise}
     */
    patch<T>(url: string, options: HttpRequestOptions = {}): Promise<T> {
      return http.request(url, { ...options, method: HttpMethods.Patch });
    },

    /**
     * Make an http request
     * @param {string} url - url to call
     * @param {HttpRequestOptions} options
     * @returns {Promise}
     */
    async request<T, R = HttpResponse<T>>(url: string, options: HttpRequestOptions = {}): Promise<R> {
      options.url = url;
      const requestOptions = initialRequest(options);

      // Handler interceptors request
      let promise = Promise.resolve(requestOptions);
      context.interceptors.request.forEach(interceptor => {
        promise = promise.then(interceptor.fulfilled);
      });
      await promise;

      // Perform request
      const rawUrl = requestOptions.url || '/';
      const requestUrl = rawUrl.startsWith('http') ? rawUrl : `${http.config.endpoint}${rawUrl}`;
      let timeout: ReturnType<typeof setTimeout>;
      if (AbortController && !requestOptions.signal && requestOptions.timeout !== 0) {
        const controller = new AbortController();
        timeout = setTimeout(() => {
          controller.abort();
        }, requestOptions.timeout);
        requestOptions.signal = controller.signal;
      }

      return fetch(requestUrl, {
        method: (requestOptions.method || HttpMethods.Get).toUpperCase(),
        body: requestOptions.body,
        headers: requestOptions.headers,
        credentials: requestOptions.credentials || 'same-origin',
        signal: requestOptions.signal,
      })
        .then(async response => {
          const data = await parseResponse<T>(response, options.responseType || 'json');
          const result: HttpResponse<T> = {
            data: <T>data,
            status: response.status,
            statusText: response.statusText,
            headers: requestOptions.headers,
            ok: response.ok,
          };

          // Handle response success
          if (response.ok) {
            let promise = Promise.resolve(result);
            context.interceptors.response.forEach(function (interceptor) {
              promise = promise.then(interceptor.fulfilled);
            });
            await promise;

            return Promise.resolve(<R>(<unknown>result));
          }

          if (options.retry !== false) {
            const defaultRetries = isPayloadMethod(options.method) ? 0 : 1;
            const retries = typeof options.retry === 'number' ? options.retry : defaultRetries;
            if (retries > 0 && retryStatusCodes.has(response.status)) {
              return http.request<T, R>(url, {
                ...options,
                retry: retries - 1,
              });
            }
          }

          // Handle response error
          const err: HttpError = {
            name: response.statusText,
            message: response.statusText,
            response: result,
          };

          let promise = Promise.resolve(err);
          context.interceptors.response.forEach(function (interceptor) {
            promise = promise.then(interceptor.rejected);
          });
          await promise;

          return Promise.reject(err);
        })
        .catch(err => {
          throw handleError(err);
        })
        .finally(() => {
          if (timeout) {
            clearTimeout(timeout);
          }
        });
    },
    _context: context,
    config: context.config,
  });

  return http;
}
