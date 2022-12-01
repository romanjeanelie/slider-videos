// Maximal requested image width from Cloudinary
export const MAX_RENDITION = 2560;

// Limit above which we consider the MAX CONNECTION_QUALITY
export const DOWNLINK_LIMITS = {
  ECO: 2,
  MID: 5,
};

export const INITIAL_CONNECTION_TYPE = "4g";

export const CONNECTION_TYPES = {
  MAX: "4g",
  ECO: "3g",
  LOW: "2g",
};

/**
 * Custom network qualities based on bandwidth measurement from getDownlink utility
 * @type {{ECO: string, MAX: string, LOW: string, MID: string}}
 */
export const NETWORK_QUALITIES = {
  MAX: "max",
  ECO: "eco",
  MID: "mid",
  LOW: "low",
};

/**
 * Cloudinary quality transformation and retina support
 * based on above NETWORK_QUALITIES
 * -> usage [ratio, [images quality, videos quality]]
 * @type {object}
 */
export const CONNECTIONS_MAP = {
  [NETWORK_QUALITIES.LOW]: [4, [`auto:${NETWORK_QUALITIES.LOW}`, `auto:${NETWORK_QUALITIES.LOW}`]],
  [NETWORK_QUALITIES.ECO]: [2, [`auto:${NETWORK_QUALITIES.ECO}`, `auto:${NETWORK_QUALITIES.ECO}`]],
  [NETWORK_QUALITIES.MID]: [1, [`auto:${NETWORK_QUALITIES.ECO}`, `auto:${NETWORK_QUALITIES.ECO}`]],
  [NETWORK_QUALITIES.MAX]: [1, ["auto", "auto"]],
};
