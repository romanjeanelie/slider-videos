import { useEffect, useRef, useState } from "react";
import SliderVideos from "./components/SliderVideos";
import AssetsGenerator from "@/modules/AssetsGenerator";
import { READY_STATES } from "@/constants";
import { throttle } from "lodash";

import Preload from "preload-it";

import styled from "styled-components";

const videoLinks = ["/videos/1.mp4", "/videos/2.mp4", "/videos/3.mp4", "/videos/4.mp4"];

const Loader = styled.div`
  text-align: center;
  p {
    margin: 4px 0;
  }
`;

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [videos, setVideos] = useState([]);

  // Ref
  const preloadRef = useRef();
  const progressRef = useRef();

  // Preload videos
  useEffect(() => {
    if (!preloadRef.current) {
      preloadRef.current = Preload();

      preloadRef.current.fetch(videoLinks);

      preloadRef.current.oncomplete = (items) => {
        setVideos(items);
        setIsLoaded(true);
      };

      preloadRef.current.onprogress = (event) => {
        progressRef.current.innerText = event.progress + "%";
      };
    }
  }, []);

  return (
    <div className="App">
      {isLoaded ? (
        <SliderVideos videos={videos} />
      ) : (
        <Loader>
          <p>chargement</p>
          <p ref={progressRef}></p>
        </Loader>
      )}
    </div>
  );
}

export default App;
