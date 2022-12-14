import React from "react";

// Styles
import styled from "styled-components";

const Container = styled.div``;
const Svg = styled.svg`
  animation: rotate 2s linear infinite;
  & circle {
    stroke: #333;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

const Spinner = () => {
  return (
    <Container>
      <Svg viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" strokeWidth="2"></circle>
      </Svg>
    </Container>
  );
};

export default Spinner;
