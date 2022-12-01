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
class Fetcher {
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

const fetcher = new Fetcher(),
  fetchAsset = (data, retry = true) => {
    const { src, key } = data;

    // @todo Better implement error handling due to bad response headers
    fetcher
      .get({
        url: src.replace(/(https?:)?\/\//, "https://"), // In case, protocol is not present...
        abort: false,
      })
      .then(async (response) => {
        if (!response.ok) {
          throw Error(`${response.status} ${response.statusText}`);
        }

        if (!response.body) {
          throw Error("ReadableStream not yet supported in this browser.");
        }

        // To access headers, server must send CORS header "Access-Control-Expose-Headers: content-encoding, content-length x-file-size"
        // Server must send custom x-file-size header if gzip or other content-encoding is used
        const contentEncoding = response.headers.get("content-encoding"),
          contentLength = response.headers.get(contentEncoding ? "x-file-size" : "content-length");

        if (contentLength === null) {
          console.log("❗ Response size header unavailable");
        }

        const reader = response.body.getReader(),
          total = contentLength === null ? null : parseInt(contentLength, 10);

        let loaded = 0;

        // https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
        return new Response(
          new ReadableStream({
            start(controller) {
              const read = () => {
                reader
                  .read()
                  .then(({ done, value }) => {
                    if (done) {
                      controller.close();
                      return;
                    }

                    loaded += value.byteLength;

                    self.postMessage({
                      type: "fetch-progress",
                      progress: loaded / (total || loaded),
                      key,
                    });

                    controller.enqueue(value);
                    read();
                  })
                  .catch((error) => {
                    console.error(error);
                    controller.error(error);
                  });
              };

              read();
            },
          }),
          // Transmit original response headers, essentially for Safari
          // to correctly read blob's content-type
          { headers: response.headers }
        );
      })
      .then((response) => response.blob())
      .then((blob) => {
        console.log("✅ Video fetch successfully:", src);
        self.postMessage({
          type: "fetch-end",
          success: true,
          progress: 1,
          blob,
          src,
          key,
        });
      })
      .catch((error) => {
        if (retry) {
          console.log("❗ Video fetch failed, retrying:", error.message);
          fetchAsset(data, false);
        } else {
          console.error("❗ Video fetch failed:", error.message);
          self.postMessage({
            type: "fetch-end",
            success: false,
            progress: 1,
            src,
            key,
          });
        }
      });
  };

/**
 * @todo Implement error handling due to missing input data or content-length header
 * @see https://github.com/AnthumChris/fetch-progress-indicators/blob/master/fetch-basic/supported-browser.js
 */
self.addEventListener("message", (e) => {
  const { type, message } = e.data;

  if (message) {
    console.error("✅", message);
  }

  if (type === "fetch-start" && e.data.src) {
    fetchAsset(e.data);
  }
});
