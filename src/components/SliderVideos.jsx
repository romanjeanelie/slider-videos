import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { suspend } from "suspend-react";
import { PreloadMedia, MediaType } from "react-preload-media";
import blobToDataURL from "@/utils/blobToDataUrl";
import { gsap } from "gsap";
// Modules
import Slider from "@/modules/Slider.js";

// Components
import Spinner from "./Spinner";

// Styles
import styled from "styled-components";

// const media = [
//   {
//     type: MediaType.Video,
//     url: "https://player.vimeo.com/progressive_redirect/playback/745429773/rendition/1080p/file.mp4?loc=external&signature=9a1f98f1c56ffd0b67690bb358d1c897a02390b0d2d2b8c841e80478cbc69273",
//   },
//   {
//     type: MediaType.Video,
//     url: "https://player.vimeo.com/progressive_redirect/playback/745436813/rendition/1080p/file.mp4?loc=external&signature=21ef6b89911f7c316c93d6274fbc86602b7a62b4d0b46cf8481ea6825e0e0df5",
//   },
// ];

const media = [
  { type: MediaType.Image, url: "https://via.placeholder.com/150" },
  { type: MediaType.Image, url: "https://via.placeholder.com/300" },
  { type: MediaType.Audio, url: "https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3" },
];

const videoLinks = ["./videos/1.mp4", "./videos/2.mp4", "./videos/3.mp4", "./videos/4.mp4"];

const Container = styled.div`
  height: 100%;
  overflow: hidden;
`;
const Loader = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
`;

const VideoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: -webkit-fill-available;

  & > div {
    width: 100%;
    height: 100%;
  }
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 300ms;

    &.is-loaded {
      opacity: 1;
    }
  }
`;

const Video = ({ src }) => {
  // Refs
  const containerRef = useRef();

  return (
    <>
      <video src={src} crossOrigin="anonymous" muted react-preload-media loop playsInline autoPlay />
    </>
  );
};

const SliderVideos = ({ videos }) => {
  // State
  const [assetsUrlsCreated, setAssetsUrlsCreated] = useState(false);
  // Refs
  const sliderRef = useRef();
  const containerRef = useRef();
  const videoContainerRef = useRef();

  useEffect(() => {});

  // Create assets urls
  const createAssetsUrls = useCallback(async (assets) => {
    await Promise.all(
      Object.values(assets).map((asset) => {
        gsap.delayedCall(0.1, async () => {
          asset.url = await blobToDataURL(asset.blob);
        });
      })
    );

    setAssetsUrlsCreated(true);
  }, []);

  useEffect(() => {
    if (!assetsUrlsCreated) {
      createAssetsUrls(videos);
    }
  }, []);

  console.log(videos);

  // Init Slider
  useEffect(() => {
    if (!sliderRef.current && assetsUrlsCreated) {
      sliderRef.current = new Slider({ container: containerRef.current });
    }
  }, [assetsUrlsCreated]);

  if (!assetsUrlsCreated) return null;

  return (
    <>
      <Container ref={containerRef}>
        {videos.map((video, i) => (
          <VideoContainer key={i} ref={videoContainerRef}>
            <video src={video.url} crossOrigin="anonymous" muted loop playsInline autoPlay />
            {/* <Video src={videoLink} onAssetLoad={onAssetLoad} /> */}
          </VideoContainer>
        ))}
      </Container>
    </>
  );
};

export default SliderVideos;
