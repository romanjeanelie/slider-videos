import React from "react";

// Styles
import styled from "styled-components";

const Container = styled.div``;
const Svg = styled.svg`
  animation: rotate 2s linear infinite;
  & .path {
    stroke: #333;
    stroke-linecap: round;
    animation: dash 2s ease-in-out infinite;
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
      <Svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="1.5"></circle>
      </Svg>
    </Container>
  );
};

export default Spinner;
