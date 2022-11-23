import React, { useEffect, useRef } from "react";

// Modules
import Slider from "@/modules/Slider.js";

// Styles
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  overflow: hidden;
`;

const VideoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 80vh;
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const videoLinks = ["videos/1.mp4", "videos/2.mp4", "videos/3.mp4", "videos/4.mp4"];

const SliderVideos = () => {
  // Init Slider
  useEffect(() => {
    if (sliderRef.current) return;
    sliderRef.current = new Slider({ container: containerRef.current });
  }, []);

  // Refs
  const sliderRef = useRef();
  const containerRef = useRef();

  return (
    <Container ref={containerRef}>
      {videoLinks.map((videoLink, i) => (
        <VideoContainer key={i}>
          <video src={videoLink} crossOrigin="anonymous" muted loop playsInline autoPlay />
        </VideoContainer>
      ))}
    </Container>
  );
};

export default SliderVideos;
