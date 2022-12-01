export const VOLUME = 0.5;

export const COMPONENTS = {
  NAVIGATION: {
    MAIN: "navigation.main",
    MINIMAP: "navigation.minimap",
  },
  CONTROLROOM: {
    VIDEO_TRANSITION_PHOTO: "controlRoom.videoTransitionPhoto",
    FINAL_VIDEO_DESKTOP: "controlRoom.finalVideoDesktop",
    FINAL_VIDEO_MOBILE: "controlRoom.finalVideoMobile",
  },
};

// @TODO CLEAN
export const SCREENS = {
  HOME: "home", // Modal closed or transitioning state type for interstitial screens
  MOON_WALK: "moon-walk",
  CONTROL_ROOM: "control-room",
};

export const PLATFORMS = {
  HYBRIS: "hybris",
  AEM: "aem",
};

export const VERSIONS = {
  STATIC: "static",
  EXPERIENCE: "experience",
};

export const MEDIA_TYPES = {
  VIDEO: "video",
  IMAGE: "image",
};

export const READY_STATES = {
  LOADING: "loading",
  INTERACTIVE: "interactive",
  COMPLETE: "complete",
  REVOCABLE: "revocable",
  ERROR: "error",
};
