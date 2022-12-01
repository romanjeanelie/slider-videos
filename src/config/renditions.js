import { COMPONENTS } from "@/constants";

export const VIDEOS_WITH_CONTROLS = [];

/**
 * /!\ 	Entries of ratio object must be contributed
 * 		in the same reversed order as the BREAKPOINTS constant, i.e.,
 * 		{
 * 			base: 1
 * 			'desktop-uhd': 2560
 * 			'desktop-hd': 1920
 * 			'desktop-md': 1600
 * 			'desktop-ld': 1440
 * 			'tablet-landscape': 1280
 * 			'tablet-portrait': 1024
 * 			'mobile-landscape': 926
 * 			'mobile-portrait': 428
 * 			'mobile-verysmallheight-portrait': 428
 * 			'mobile-smallheight-portrait': 428
 * 		}
 *
 * 	->  Before falling back to reading 'base' value, default breakpoints for
 * 		mobile,				tablet, 			and desktop breakpoints are respectively
 * 		mobile-portrait, 	tablet-portrait, 	and desktop-uhd
 * @type {{}}
 */
export const RENDITIONS_BY_TYPE = {
  default: {
    ratio: 1,
    transformationBefore: "",
    transformationAfter: "",
  },
  [COMPONENTS.CONTROLROOM.VIDEO_TRANSITION_PHOTO]: {
    ratio: {
      base: 1,
      "desktop-uhd": 720 / 2560,
      "desktop-hd": 720 / 1920,
      "desktop-md": 720 / 1600,
      "desktop-ld": 720 / 1440,
      "tablet-landscape": 720 / 1280,
      "tablet-portrait": 720 / 1024,
      "mobile-landscape": 720 / 926,
      "mobile-portrait": 720 / 428,
      "mobile-verysmallheight-portrait": 720 / 428,
      "mobile-smallheight-portrait": 720 / 428,
    },
  },
  [COMPONENTS.CONTROLROOM.FINAL_VIDEO_DESKTOP]: {
    ratio: {
      base: 1680 / 1600,
      "desktop-uhd": 1680 / 2560,
      "desktop-hd": 1680 / 1920,
      "desktop-md": 1600 / 1600,
      "desktop-ld": 1440 / 1440,
      "tablet-landscape": 1280 / 1280,
      "tablet-portrait": 1024 / 1024,
      "mobile-landscape": 926 / 926,
    },
  },
  [COMPONENTS.CONTROLROOM.FINAL_VIDEO_MOBILE]: {
    ratio: {
      base: 1,
      // 'mobile-landscape': 750 / 926,
      // 'mobile-portrait': 428 / 428,
      // 'mobile-verysmallheight-portrait': 428 / 428,
      // 'mobile-smallheight-portrait': 428 / 428,
    },
  },
};
