import UAParser from "ua-parser-js";

const uaParser = new UAParser(),
  OS = uaParser.getOS(),
  BROWSER = uaParser.getBrowser(),
  UA = uaParser.getUA().toLowerCase();

/**
 * Check browser's video type support
 * @type {{
 * 'video/mp4;codecs=hvc1': CanPlayTypeResult,
 * 'video/webm;codecs=vp9': CanPlayTypeResult,
 * 'video/webm;codecs=vp8': CanPlayTypeResult,
 * 'video/mp4;codecs=hevc': CanPlayTypeResult,
 * 'video/mp4;codecs=avc1': CanPlayTypeResult
 * }}
 */
const canPlayType = (() => {
  const f = (type) => document.createElement("video").canPlayType(type);
  return {
    "video/mp4;codecs=avc1": f("video/mp4;codecs=avc1"),
    "video/mp4;codecs=hevc": f("video/mp4;codecs=hevc"),
    "video/mp4;codecs=hvc1": f("video/mp4;codecs=hvc1"),
    "video/webm;codecs=vp8": f("video/webm;codecs=vp8"),
    "video/webm;codecs=vp9": f("video/webm;codecs=vp9"),
  };
})();

/**
 * Check browser's webP image format support
 * @type {boolean}
 */
const canUseWebP = (() => {
  const elem = document.createElement("canvas");
  if (elem.getContext && elem.getContext("2d")) {
    return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  }
  return false;
})();

/**
 * Check if device is iOS
 * @see https://github.com/faisalman/ua-parser-js#methods
 */
const isIOS = () => OS.name === "iOS" || isIpad();
const isWindows = () => OS.name === "Windows";
const isAndroid = () => OS.name.startsWith("Android");
const isSafari = () => BROWSER.name.includes("Safari"); //Can be "Mobile Safari" OR "Safari"
const isFirefox = () => BROWSER.name.includes("Firefox");
const isWeChat = () => BROWSER.name === "WeChat" || UA.includes("micromessenger");
const isWebView = () => BROWSER.name.includes("Instagram") || isWeChat();

const isIpad = () => {
  const ua = window.navigator.userAgent;

  if (ua.indexOf("iPad") > -1) {
    return true;
  }

  if (ua.indexOf("Macintosh") > -1) {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  }

  return false;
};

/**
 *
 * @return {{vendor: *, name: *, model: *, type: *, version: *}}
 */
const getDeviceInformation = () => UAParser();

export {
  canPlayType,
  canUseWebP,
  getDeviceInformation,
  isIOS,
  isWindows,
  isAndroid,
  isIpad,
  isSafari,
  isFirefox,
  isWeChat,
  isWebView,
};
