/**
 * Check response status to trigger Fetch Promise's catch method on non-ok response.
 * @see https://github.com/developit/unfetch#caveats
 * @param {Response} response
 * @return {Promise<Response> | Response}
 */
const checkFetchStatus = (response) => {
  if (response.ok) return response;

  // Convert non-2xx HTTP responses into errors:
  const error = new Error(response.statusText);
  error.response = response;
  return Promise.reject(error);
};

/**
 * A you-cannot-do-simpler fetching helper class with static methods
 */
export default class Fetcher {
  static staticController = null;

  /**
   *
   * @param url
   * @param options
   * @param abort
   * @return {Promise<Object>}
   */
  get({ url, options = { cache: "default" }, abort = true }) {
    return Fetcher.get({
      url,
      options,
      controller: this.getAbortController(abort),
    });
  }

  /**
   *
   * @param url
   * @param body
   * @param options
   * @param abort
   * @return {Promise<Object>}
   */
  post({ url, body = {}, options = { cache: "default" }, abort = true }) {
    return Fetcher.post({
      url,
      body,
      options,
      controller: this.getAbortController(abort),
    });
  }

  /**
   *
   * @param abort
   * @return {AbortController}
   */
  getAbortController(abort) {
    if (abort) {
      this.abort();
    }

    this.controller = new AbortController();

    return this.controller;
  }

  /**
   *
   */
  abort() {
    if (this.controller) {
      this.controller.abort();
    }
  }

  /**
   * Static Fetch get
   * @param {string} url - URL to fetch
   * @param {object} options - Fetch API options
   * @param {AbortController} [controller]
   * @return {Promise<object>}
   */
  static get({ url, options = { cache: "default" }, controller }) {
    if (!controller) {
      Fetcher.staticController = controller = new AbortController();
    } else if (Fetcher.staticController) {
      Fetcher.staticController.abort();
    }

    return new Promise((resolve, reject) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/Request/cache#value
      fetch(url, {
        method: "GET",
        signal: controller.signal,
        ...options,
      })
        .then(checkFetchStatus)
        .then(resolve)
        .catch((e) => {
          if (e.name === "AbortError") {
            Fetcher.staticController = this.controller = null;
          }
          reject(e);
        });
    });
  }

  /**
   * Static Fetch post
   * @param{string} url
   * @param {object} [body={}]
   * @param {object} [options={}]
   * @param {AbortController} [controller]
   * @return {Promise<object>}
   */
  static post({ url, body = {}, options = {}, controller }) {
    if (!controller) {
      Fetcher.staticController = controller = new AbortController();
    } else if (Fetcher.staticController) {
      Fetcher.staticController.abort();
    }

    return new Promise((resolve, reject) => {
      const data = new FormData();

      for (const key in body) {
        if (Object.prototype.hasOwnProperty.call(body, key)) {
          data.append(key, body[key]);
        }
      }

      fetch(url, {
        method: "POST",
        body: data,
        ...options,
        ...(controller && { signal: controller.signal }),
      })
        .then(checkFetchStatus)
        .then(resolve)
        .catch((e) => {
          if (e.name === "AbortError") {
            Fetcher.staticController = this.controller = null;
          }
          reject(e);
        });
    });
  }
}
