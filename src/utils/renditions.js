import { BREAKPOINTS, NETWORK_QUALITIES, CONNECTIONS_MAP, MAX_RENDITION } from "@/constants";
import { RENDITIONS_BY_TYPE } from "@/config/renditions";
import { canPlayType, canUseWebP, isIpad } from "@/utils/deviceDetect";

const IPAD = isIpad();

/**
 * @param {string} networkQuality
 * @return {number}
 */
const getDevicePixelRatio = (networkQuality) =>
  window.devicePixelRatio > 1 && [NETWORK_QUALITIES.MAX, NETWORK_QUALITIES.MID].includes(networkQuality) ? 2 : 1;

/**
 * @todo Cloudinary transformations before and after depending on the breakpoint.
 * @param {string} componentType
 */
const getRenditions = (componentType) => {
  const renditions = RENDITIONS_BY_TYPE[componentType] || RENDITIONS_BY_TYPE.default,
    {
      ratio: defaultRatio,
      transformationBefore: defaultTransformationBefore,
      transformationAfter: defaultTransformationAfter,
    } = RENDITIONS_BY_TYPE.default,
    {
      ratio = defaultRatio,
      transformationBefore = defaultTransformationBefore,
      transformationAfter = defaultTransformationAfter,
    } = renditions,
    breakpoints = Object.keys(BREAKPOINTS),
    mobileBreakpoints = breakpoints.filter((b) => b.startsWith("mobile-")),
    tabletBreakpoints = breakpoints.filter((b) => b.startsWith("tablet-")),
    desktopBreakpoints = breakpoints.filter((b) => b.startsWith("desktop-"));

  return breakpoints.map((breakpoint) => {
    const media = BREAKPOINTS[breakpoint],
      myTransformation =
        typeof transformationBefore[breakpoint] === "string"
          ? transformationBefore[breakpoint]
          : defaultTransformationBefore,
      myTransformationAfter =
        typeof transformationAfter[breakpoint] === "string"
          ? transformationAfter[breakpoint]
          : defaultTransformationAfter;

    let myRatio;

    if (mobileBreakpoints.includes(breakpoint)) {
      myRatio = ratio[breakpoint] || ratio["mobile-portrait"] || ratio.base || defaultRatio;
    } else if (tabletBreakpoints.includes(breakpoint)) {
      myRatio = ratio[breakpoint] || ratio["tablet-portrait"] || ratio.base || defaultRatio;
    } else if (desktopBreakpoints.includes(breakpoint)) {
      myRatio = ratio[breakpoint] || ratio["desktop-uhd"] || ratio.base || defaultRatio;
    }

    let pxSize = false;

    if (typeof myRatio === "string") {
      pxSize = parseFloat(myRatio);
      if (isNaN(pxSize)) pxSize = false;
    }

    return {
      media,
      breakpoint,
      absolute: pxSize !== false,
      size: Math.round(pxSize !== false ? pxSize : media * myRatio), // Closest even
      transformationBefore: myTransformation,
      transformationAfter: myTransformationAfter,
    };
  });
};

/**
 *
 * @param {array} renditions
 * @param {string} currentBreakpoint
 * @param {string} networkQuality
 * @param {boolean} [isVideo=false]
 * @return {{size: *, dpr: number, transformationBefore: *, transformationAfter: *, quality: *}}
 */
const getRendition = (renditions, currentBreakpoint, networkQuality, isVideo = false) => {
  let index = renditions.findIndex((el) => el.breakpoint === currentBreakpoint);
  if (index < 0) index = renditions.length - 1;

  const { size, transformationBefore, transformationAfter } = renditions[index],
    dpr = getDevicePixelRatio(networkQuality),
    quality = CONNECTIONS_MAP[networkQuality][1][isVideo ? 1 : 0];

  return {
    dpr,
    size,
    quality,
    transformationBefore,
    transformationAfter,
  };
};

/**
 * Utility to get a Cloudinary asset path for image or video
 * @see https://cloudinary.com/documentation/transformation_reference
 * @param {string} baseURL
 * @param {string} filename
 * @param {string} breakpoint
 * @param {string} [componentType]
 * @param {string} [networkQuality]
 * @param {boolean} forceMP4
 * @param {number} [scale]
 * @returns {{size: number, src: string}}
 */
const getMediaSrc = ({
  baseURL,
  filename,
  breakpoint,
  componentType,
  networkQuality = NETWORK_QUALITIES.ECO,
  forceMP4 = false,
  scale = 1,
}) => {
  const isVideo = filename?.endsWith(".mp4") || false, // .mp4 file should only be contributed as video files
    renditions = getRenditions(componentType),
    {
      dpr,
      size,
      quality,
      transformationBefore: tBefore,
      transformationAfter: tAfter,
    } = getRendition(renditions, breakpoint, networkQuality, isVideo),
    effectiveSize = (!IPAD || !isVideo ? 2 : 1) * Math.round(0.5 * dpr * size * scale), // Closest even
    tSize = Math.min(
      effectiveSize,
      [NETWORK_QUALITIES.MAX, NETWORK_QUALITIES.MID].includes(networkQuality)
        ? MAX_RENDITION
        : BREAKPOINTS["desktop-hd"]
    ),
    tQuality = `/q_${size <= 200 ? 100 : quality}`;

  let tFormat = ""; // @todo Find why .jp2 is returned for images when using ",f_auto,fl_lossy,dpr_auto"
  if (isVideo) {
    // Use webm when possible
    if (!forceMP4 && (!!canPlayType["video/webm;codecs=vp9"] || !!canPlayType["video/webm;codecs=vp8"])) {
      tFormat = "/f_webm";
      filename = filename.replace(".mp4", ".webm");
    }
    // Use H265 when possible
    else if (!IPAD && (!!canPlayType["video/mp4;codecs=hevc"] || !!canPlayType["video/mp4;codecs=hvc1"])) {
      tFormat = "/f_mp4/vc_h265";
    } else {
      tFormat = "/f_mp4";
    }
  } else if (canUseWebP) {
    tFormat = "/f_webp";
  }

  return {
    src: `${baseURL}${tBefore ? `${tBefore}` : ""}${tFormat}/w_${tSize}${tQuality}${
      tAfter ? `/${tAfter}` : ""
    }/${filename}`,
    srcFullResolution: `${baseURL}${tBefore ? `${tBefore}` : ""}${tFormat}/${filename}`,
    size,
  };
};

export { getDevicePixelRatio, getMediaSrc };
