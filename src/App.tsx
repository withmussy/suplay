import React, { useState } from "react";
import "./App.css";
import 'antd/dist/reset.css';
import "./dictionary-style.css";
import styled from "styled-components";
import AddVideoSession from "./components/VideoSession/AddVideoSession";
import { DataToPlayType } from "./components/VideoSession/AddVideoSession";
import VideoSession from "./components/VideoSession/index";
import BackgroundFile from "./assets/images/bg-movies.jpg";

const App = () => {
  const [Play, setPlay] = useState<boolean>(false);
  const [Data, setData] = useState<DataToPlayType>({ video: "", subtitle: "" });

  const handlePlay = (data: { video: string; subtitle?: string }) => {
    setData(data);
    setPlay(true);
  };

  return (
    <Wrapper>
      <img src={BackgroundFile} className="background" />
      {!Play ? (
        <AddVideoSession onPlay={handlePlay} />
      ) : (
        <VideoSession data={Data} />
      )}
    </Wrapper>
  );
};

export default App;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;

  .background {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("/images/bg-movies.jpg");
    transform: scale(1.02);
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.8) 0,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 0.8) 100%
    );
  }
`;
