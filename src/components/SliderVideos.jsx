import React, { useState, useEffect, useRef, Suspense } from "react";
import { useAsset, createAsset } from "use-asset";
// Modules
import Slider from "@/modules/Slider.js";

// Styles
import styled from "styled-components";

const videoLinks = [
  "https://player.vimeo.com/progressive_redirect/playback/745429773/rendition/1080p/file.mp4?loc=external&signature=9a1f98f1c56ffd0b67690bb358d1c897a02390b0d2d2b8c841e80478cbc69273",
  "https://player.vimeo.com/progressive_redirect/playback/745436813/rendition/1080p/file.mp4?loc=external&signature=21ef6b89911f7c316c93d6274fbc86602b7a62b4d0b46cf8481ea6825e0e0df5",
  "https://player.vimeo.com/progressive_redirect/playback/745438360/rendition/1080p/file.mp4?loc=external&signature=d9cd1b7eb2e898e30e8abb2764d2e8b9d4ea1ce0f7e78101a5e2998e4d5de042",
  "https://player.vimeo.com/progressive_redirect/playback/745439503/rendition/1080p/file.mp4?loc=external&signature=73b07aa2a65ce25f9f0533cd207d1ad5907489bf596ebe1d37e7fb2274434855",
  "https://player.vimeo.com/progressive_redirect/playback/745435539/rendition/1080p/file.mp4?loc=external&signature=006c81c361a16764fb9bd8b6e2a23b6bab008e9dd563eef80e206db62a806f2b",
  "https://player.vimeo.com/progressive_redirect/playback/755610395/rendition/1080p/file.mp4?loc=external&signature=9952f9d547936b19357794a86e1d4cacffeefc9665ca1665ac28ecfbe8df55ea",
];

const Container = styled.div`
  height: 100%;
  overflow: hidden;
`;

const VideoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: -webkit-fill-available;

  p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);

    transition: opacity 300ms;
    &.is-loaded {
      opacity: 0;
    }
  }
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 300ms;

    &.is-loaded {
      opacity: 1;
    }
  }
`;

const Fallback = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
`;

const Video = ({ src, onAssetLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) onAssetLoad();
  }, [isLoaded]);

  return (
    <VideoContainer>
      <p className={isLoaded && "is-loaded"}>loading</p>
      <video
        className={isLoaded && "is-loaded"}
        src={src}
        crossOrigin="anonymous"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        onCanPlayThrough={() => setIsLoaded(true)}
      />
    </VideoContainer>
  );
};

const SliderVideos = () => {
  // State
  const [assetsLoaded, setAssetsLoaded] = useState(0);
  const [allAssetsLoaded, setAllAssetsLoaded] = useState(0);

  // Refs
  const sliderRef = useRef();
  const containerRef = useRef();

  const onAssetLoad = () => {
    setAssetsLoaded((prev) => prev + 1);
  };

  useEffect(() => {
    if (assetsLoaded === videoLinks.length) setAllAssetsLoaded(true);
  }, [assetsLoaded]);

  // Init Slider
  useEffect(() => {
    if (!sliderRef.current) {
      sliderRef.current = new Slider({ container: containerRef.current });
    }
  }, []);

  return (
    <>
      {/* {!allAssetsLoaded && <Fallback>Loading</Fallback>} */}
      <Container ref={containerRef}>
        {videoLinks.map((videoLink, i) => (
          <Video key={i} src={videoLink} onAssetLoad={onAssetLoad} />
        ))}
      </Container>
    </>
  );
};

export default SliderVideos;
