import Fetcher from "@/modules/Fetcher";
import { getMediaSrc } from "@/utils/renditions";
import { READY_STATES, MEDIA_TYPES } from "@/constants";
import { isSafari } from "@/utils/deviceDetect";

const __DEV__ = process.env.NODE_ENV === "development";
const SAFARI = isSafari();
/**
 * Beware of the postMessage in Safari that can throw
 * DataCloneError: The object can not be cloned on postMessage
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects
 * @type {AssetsGenerator}
 */
class AssetsGenerator {
  static ASSETS = new Map();

  /**
   * Constructor
   * @param {object} assetsPath -
   * @param {string} assetsPath.core -
   * @param {string} assetsPath.videos -
   * @param {string} assetsPath.images -
   * @param {string} workerPath - Used in PROD only
   */
  constructor({ core, videos, images }, workerPath) {
    this.coreAssetsPath = core;
    this.videosAssetsPath = videos;
    this.imagesAssetsPath = images;
    this.workerPath = workerPath;
  }

  /**
   * Due to CORS, Web Worker (WW) script has to be XHR-fetched in production.
   * On the other hand, in development, WW can simply be loaded via Webpack 5 native support.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker
   * @return {Promise<object>}
   */
  loadWorker() {
    return new Promise((resolve, reject) => {
      try {
        // HMR OK in dev
        if (__DEV__) {
          const workerURL = new URL("../../asset.worker.js", import.meta.url);
          this.worker = new Worker(workerURL);
          this.setInteractive(resolve);
        }
        // Worker script has to be fetched to overcome CORS issue in production
        else {
          this.workerFetcher = new Fetcher();
          this.workerFetcher
            .get({ url: `${this.coreAssetsPath}${this.workerPath}` })
            .then(async (response) => {
              try {
                const workerScript = await response.text();
                this.worker = new Worker(URL.createObjectURL(new Blob([workerScript])));
                this.setInteractive(resolve);
              } catch (e) {
                reject({
                  ...e,
                  readyState: READY_STATES.ERROR,
                });
              }
            })
            .catch(reject);
        }
      } catch (e) {
        reject({
          ...e,
          readyState: READY_STATES.ERROR,
        });
      }
    });
  }

  /**
   *
   * @param {function} resolve
   */
  setInteractive(resolve) {
    this.worker.addEventListener("message", ({ data }) => {
      switch (data.type) {
        case "fetch-progress":
          this.onFetchProgress(data);
          break;
        case "fetch-end":
          this.onFetchEnd(data);
          break;
        default:
          this.onFetchUndefined(data);
      }
    });

    resolve({ readyState: READY_STATES.INTERACTIVE });
  }

  /**
   * @param {Map} assetsMap
   * @param {string} breakpoint
   * @param {string} networkQuality
   * @param {boolean} lowPower
   * @param {function} onProgress
   * @return {Promise<object>}
   */
  createAssets(assetsMap, breakpoint, networkQuality, useImage, onProgress) {
    this.onProgress = typeof onProgress === "function" ? onProgress : () => {};

    const mobile = breakpoint.endsWith("-portrait"),
      promises = [];

    for (const [oKey, element] of assetsMap.entries()) {
      promises.push(
        new Promise((resolve, reject) => {
          try {
            const isImage = element.type === "image" || useImage;
            const asset =
              element.type === "image"
                ? element.image
                : useImage
                ? element.image
                  ? element.image
                  : element.video
                : element.video;

            const file = asset.url ? asset : asset[mobile ? "mobile" : "desktop"];
            const { url } = file;
            const src = url;

            // JSON.stringify in order for Map.prototype.has() to work with object key
            // const key = JSON.stringify({
            //   ...oKey,
            //   ...{ type: isImage ? MEDIA_TYPES.IMAGE : MEDIA_TYPES.VIDEO },
            // });
            const key = oKey;

            // Cache asset
            if (!AssetsGenerator.ASSETS.has(key)) {
              AssetsGenerator.ASSETS.set(key, {
                progress: 0,
                resolve,
                reject,
              });
            }

            // Start fetching
            this.worker.postMessage({
              type: "fetch-start",
              src,
              key,
            });
          } catch (e) {
            reject(e);
          }
        })
      );
    }

    return Promise.all(promises)
      .then(async (assetsAll) => {
        console.log(assetsAll);
        // Clear internal Map
        this.clearAssets();
        // Return object
        return {
          message: "✅ ALL ASSETS FETCHED SUCCESSFULLY",
          // assets: assetsAll.reduce((acc, value) => {
          //   const { key: sKey, blob, src } = value;
          //   const { screen, name, type } = JSON.parse(sKey); // Parse key stringified above

          //   acc[screen] = acc[screen] || {};
          //   acc[screen][name] = acc[screen][name] || [];
          //   acc[screen][name] = { name, blob, src, type };

          //   return acc;
          // }, {}),
          assets: assetsAll,
        };
      })
      .catch((e) => {
        // Clear internal Map
        this.clearAssets();

        return {
          message: `❗ ALL ASSETS FETCHED FAILED: ${e.message}`,
          assets: {},
        };
      });
  }

  clearAssets() {
    AssetsGenerator.ASSETS.clear();
  }

  /**
   * Use for proper cleanup to:
   * - Abort pending fetch request to worker script (PROD only)
   * - Terminate working Web Worker
   */
  destroy() {
    this.clearAssets();
    this.workerFetcher?.abort();
    this.worker?.terminate();
  }

  /**
   *
   * @param {object} data
   */
  onFetchProgress = (data) => {
    const { key, progress } = data;

    // Update progress value on current video
    AssetsGenerator.ASSETS.set(key, {
      ...AssetsGenerator.ASSETS.get(key),
      progress,
    });

    const globalProgressPercent =
      (100 *
        Array.from(AssetsGenerator.ASSETS.values()).reduce((accumulator, value) => accumulator + value.progress, 0)) /
      AssetsGenerator.ASSETS.size;

    // Communicate progress status to caller
    this.onProgress?.call(this, globalProgressPercent);
  };

  /**
   *
   * @param {object} data
   */
  onFetchEnd = (data) => {
    const { src, key, blob } = data;
    const { resolve } = AssetsGenerator.ASSETS.get(key);

    resolve({ key, blob, src });
  };

  /**
   *
   * @param {object} data
   */
  onFetchUndefined = (data) => {
    console.log("❗ Undefined fetch worker data", data);
  };
}

export default AssetsGenerator;
