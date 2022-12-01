import React from "react";
import { VideoCache } from "../../utils/VideoCache";

const VideoPreload = ({ src, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [video, setVideo] = useState();
  const onLoaded = () => setIsLoaded(true);

  useEffect(() => {
    if (!src) return;
    const videoElement = VideoCache.get(src);

    if (!videoElement) {
      VideoCache.store(src, onLoad)
        .then((videoEl) => {
          setLoaded(true);
          setVideo(videoEl);
        })
        .catch((err) => {
          AppLog.warn("Failed to load video", err);
        });
    } else {
      setLoaded(true);
      setVideo(videoElement);
    }

    return () => {
      VideoCache.removeListener(src);
    };
  }, [src, setLoaded]);

  if (!loaded && !props.poster) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <video src={video && video.src} {...props} ref={ref} />
      {(!loaded || !video) && <p>Loading video</p>}
    </>
  );
};

export default VideoPreload;
