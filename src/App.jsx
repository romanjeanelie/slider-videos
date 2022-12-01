import { useEffect, useRef, useState } from "react";
import SliderVideos from "./components/SliderVideos";
import AssetsGenerator from "@/modules/AssetsGenerator";
import { READY_STATES } from "@/constants";
import { throttle } from "lodash";

const videoLinks = [
  {
    type: "video",
    video: {
      url: "https://player.vimeo.com/progressive_redirect/playback/745429773/rendition/1080p/file.mp4?loc=external&signature=9a1f98f1c56ffd0b67690bb358d1c897a02390b0d2d2b8c841e80478cbc69273",
    },
  },
  {
    type: "video",
    video: {
      url: "https://player.vimeo.com/progressive_redirect/playback/745436813/rendition/1080p/file.mp4?loc=external&signature=21ef6b89911f7c316c93d6274fbc86602b7a62b4d0b46cf8481ea6825e0e0df5",
    },
  },
  {
    type: "video",
    video: {
      url: "https://player.vimeo.com/progressive_redirect/playback/745438360/rendition/1080p/file.mp4?loc=external&signature=d9cd1b7eb2e898e30e8abb2764d2e8b9d4ea1ce0f7e78101a5e2998e4d5de042",
    },
  },
  {
    type: "video",
    video: {
      url: "https://player.vimeo.com/progressive_redirect/playback/745439503/rendition/1080p/file.mp4?loc=external&signature=73b07aa2a65ce25f9f0533cd207d1ad5907489bf596ebe1d37e7fb2274434855",
    },
  },
  {
    type: "video",
    video: {
      url: "https://player.vimeo.com/progressive_redirect/playback/745435539/rendition/1080p/file.mp4?loc=external&signature=006c81c361a16764fb9bd8b6e2a23b6bab008e9dd563eef80e206db62a806f2b",
    },
  },
  {
    type: "video",
    video: {
      url: "https://player.vimeo.com/progressive_redirect/playback/755610395/rendition/1080p/file.mp4?loc=external&signature=9952f9d547936b19357794a86e1d4cacffeefc9665ca1665ac28ecfbe8df55ea",
    },
  },
];

// const videos = [
//   {
//     key: 0,
//     label: "model-1",
//     main: "https://player.vimeo.com/progressive_redirect/playback/745429773/rendition/1080p/file.mp4?loc=external&signature=9a1f98f1c56ffd0b67690bb358d1c897a02390b0d2d2b8c841e80478cbc69273",
//     details: [
//       {
//         label: "top",
//         url: "https://player.vimeo.com/progressive_redirect/playback/745436813/rendition/1080p/file.mp4?loc=external&signature=21ef6b89911f7c316c93d6274fbc86602b7a62b4d0b46cf8481ea6825e0e0df5",
//       },
//       {
//         label: "bottom",
//         url: "https://player.vimeo.com/progressive_redirect/playback/745436813/rendition/1080p/file.mp4?loc=external&signature=21ef6b89911f7c316c93d6274fbc86602b7a62b4d0b46cf8481ea6825e0e0df5",
//       },
//     ],
//   },
//   {
//     key: 1,
//     label: "model-2",
//     main: "https://player.vimeo.com/progressive_redirect/playback/745429773/rendition/1080p/file.mp4?loc=external&signature=9a1f98f1c56ffd0b67690bb358d1c897a02390b0d2d2b8c841e80478cbc69273",
//     details: [
//       {
//         label: "top",
//         url: "https://player.vimeo.com/progressive_redirect/playback/745436813/rendition/1080p/file.mp4?loc=external&signature=21ef6b89911f7c316c93d6274fbc86602b7a62b4d0b46cf8481ea6825e0e0df5",
//       },
//       {
//         label: "bottom",
//         url: "https://player.vimeo.com/progressive_redirect/playback/745436813/rendition/1080p/file.mp4?loc=external&signature=21ef6b89911f7c316c93d6274fbc86602b7a62b4d0b46cf8481ea6825e0e0df5",
//       },
//     ],
//   },
// ];

const getAssets = () => {
  const assets = new Map();

  controlRoomConfig.map((el, index) => {
    el.assets.map((asset) => {
      const { name, type, video, image } = asset;
      assets.set(
        {
          name,
          screen: el.screen,
          index,
        },
        { type, video, image }
      );
    });
  });
  return assets;
};

const THROTTLE_WAIT = 1000 / 60;

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [worker, setWorker] = useState(null);
  const [assets, setAssets] = useState(null);

  // Refs
  const refGeneratorWorker = useRef();

  // Init worker
  useEffect(() => {
    if (refGeneratorWorker.current) return;

    refGeneratorWorker.current = new AssetsGenerator("", "asset.worker.js");

    refGeneratorWorker.current
      .loadWorker()
      .then(({ readyState }) => {
        setProgress(1);
        setWorker(readyState);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  // Load assets
  useEffect(() => {
    if (worker !== READY_STATES.INTERACTIVE || isLoading || isLoaded) return;

    setIsLoading(true);

    const throttleProgress = throttle((progress) => {
      setProgress(progress);
    }, THROTTLE_WAIT);

    refGeneratorWorker.current
      .createAssets(videoLinks, "", "", false, (progress) => {
        throttleProgress(progress);
      })
      .then(({ message, assets }) => {
        setIsLoaded(true);
        setAssets(assets);
      })
      .catch((e) => {
        console.error(e);
        setWorker(e.readyState);
      });
  }, [worker]);
  return <div className="App">{isLoaded ? <SliderVideos videos={assets} /> : <p>{Math.round(progress)}%</p>}</div>;
}

export default App;
