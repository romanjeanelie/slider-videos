const BREAKPOINTS = {
  "mobile-verysmallheight-portrait": 428,
  "mobile-smallheight-portrait": 428,
  "mobile-portrait": 428,
  "mobile-landscape": 926, // To match with small breakpoint in _variables.scss
  "tablet-portrait": 1024,
  "tablet-landscape": 1280,
  "desktop-ld": 1440,
  "desktop-md": 1600,
  "desktop-hd": 1920,
  "desktop-uhd": 2560,
};

const MEDIA_QUERIES = {
  touch: "(hover: none)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  mobilePortrait: `(max-width: ${BREAKPOINTS["mobile-portrait"]}px) and (orientation: portrait)`,
  mobilePortraitSmallHeight: `(max-width: ${BREAKPOINTS["mobile-portrait"]}px) and (min-height: 569px) and (max-height: 667px) and (orientation: portrait)`,
  mobilePortraitVerySmallHeight: `(max-width: ${BREAKPOINTS["mobile-portrait"]}px) and (max-height: 568px) and (orientation: portrait)`,
  mobileLandscape: `(max-width: ${BREAKPOINTS["mobile-landscape"]}px) and (orientation: landscape)`,
  tabletPortrait: `(min-width: ${BREAKPOINTS["mobile-portrait"] + 1}px) and (max-width: ${
    BREAKPOINTS["tablet-landscape"]
  }px) and (orientation: portrait)`,
  tabletLandscape: `(min-width: ${BREAKPOINTS["mobile-landscape"] + 1}px) and (max-width: ${
    BREAKPOINTS["tablet-landscape"]
  }px) and (orientation: landscape)`,
  desktopLD: `(min-width: ${BREAKPOINTS["tablet-landscape"] + 1}px) and (max-width: ${BREAKPOINTS["desktop-ld"]}px)`,
  desktopMD: `(min-width: ${BREAKPOINTS["desktop-ld"] + 1}px) and (max-width: ${BREAKPOINTS["desktop-md"]}px)`,
  desktopHD: `(min-width: ${BREAKPOINTS["desktop-md"] + 1}px) and (max-width: ${BREAKPOINTS["desktop-hd"]}px)`,
  desktopUHD: `(min-width: ${BREAKPOINTS["desktop-hd"] + 1}px)`,
};

export { BREAKPOINTS, MEDIA_QUERIES };
