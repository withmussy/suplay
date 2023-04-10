import React, {useContext, useEffect, useState} from 'react';
import Player from '../Player/index';
import videojs from 'video.js';
import styled from 'styled-components';
import WordDefinition from './WordDefinition';
import {windowSizeContext} from '../../utils/context/windowSize';

const {SubtitleTime} = require('subtitle-time');
const {default: srtParser2} = require('srt-parser-2');

interface PropsType {
  data: {
    video: string;
    subtitle?: string;
  };
}

type SubtitleType = {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
}[];

const VideoSession = (props: PropsType) => {
  const {
    data: {video, subtitle},
  } = props;

  const playerRef: React.MutableRefObject<videojs.Player | undefined> =
    React.useRef(undefined);
  const [Subtitle, setSubtitle] = useState<SubtitleType>([]);
  const [CurrentSubtitleText, setCurrentSubtitleText] =
    useState<JSX.Element[] | null>(null);
  const [ShowCurrentSubtitleText, setShowCurrentSubtitleText] =
    useState<boolean>(false);
  const [ShowWordDefinitionModal, setShowWordDefinitionModal] =
    useState<boolean>(false);
  const [SelectedWord, setSelectedWord] = useState<string>('');

  const windowSize = useContext(windowSizeContext);

  useEffect(() => {
    playerRef.current?.width(windowSize.width);
    playerRef.current?.height(windowSize.height);
  }, [windowSize]);

  useEffect(() => {
    if (Subtitle.length === 0) {
      loadSubTitle();
    }
  }, []);

  const loadSubTitle = () => {
    if (subtitle === undefined) return;
    fetch(subtitle)
      .then(res => res.text())
      .then(text => {
        const parser = new srtParser2();

        const srtSubtitle = parser.fromSrt(text);
        setSubtitle(srtSubtitle);
      });
  };

  const options: videojs.PlayerOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    height: windowSize.height,
    width: windowSize.width,
    playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    sources: [
      {
        src: video,
        type: 'video/mp4',
      },
    ],
    controlBar: {
      currentTimeDisplay: true,
      fullscreenToggle: false,
      playbackRateMenuButton: true,
      pictureInPictureToggle:false
    },
    userActions: {
      doubleClick: false,
    },
  };

  const handleReady = (player: videojs.Player) => {
    playerRef.current = player;

    player.on('timeupdate', () => {
      const current = player.currentTime();

      findingSubtitle(current);
    });
  };

  const findingSubtitle = (currentTimeSecond: number) => {
    const text = Subtitle.filter(({startTime, endTime}) => {
      const startTimeSecond: number = convertTime(startTime);
      const endTimeSecond: number = convertTime(endTime);

      if (
        currentTimeSecond >= startTimeSecond &&
        currentTimeSecond <= endTimeSecond
      ) {
        return true;
      }

      return false;
    });

    if (text.length === 0) {
      setShowCurrentSubtitleText(false);
      return;
    }

    const finalText: JSX.Element[] = modifyText(text[0].text);

    setShowCurrentSubtitleText(true);
    setCurrentSubtitleText(finalText);
  };

  const modifyText = (text: string): JSX.Element[] => {
    const res: JSX.Element[] = text.split('\n').map((item, idx) => {
      let lineType: 'italic' | 'bold' | 'normal' = 'normal';

      if (item.indexOf('<i>') !== -1 || item.indexOf('</i>') !== -1) {
        // this is line is italic
        item = item.replaceAll('<i>', '');
        item = item.replaceAll('</i>', '');
        lineType = 'italic';
      }

      if (item.indexOf('<b>') !== -1 || item.indexOf('</b>') !== -1) {
        // this is line is bold
        item = item.replaceAll('<b>', '');
        item = item.replaceAll('</b>', '');
        lineType = 'bold';
      }

      const words: JSX.Element[] = seprateWordsToClick(item.split(' '));

      switch (lineType) {
        case 'bold':
          return (
            <div id={`line-${idx}`} className="bold" key={idx}>
              {words}
            </div>
          );
        case 'italic':
          return (
            <div id={`line-${idx}`} className="italic" key={idx}>
              {words}
            </div>
          );
        default:
          return (
            <div id={`line-${idx}`} key={idx}>
              {words}
            </div>
          );
      }
    });

    return res;
  };

  const seprateWordsToClick = (words: string[]): JSX.Element[] => {
    let res: JSX.Element[] = [];

    res = words.map((word: string, i: number) => (
      <span id={`word-${i}`} key={i} onClick={() => handleWordClick(word)}>
        {word}
      </span>
    ));

    return res;
  };

  const handleWordClick = (word: string) => {
    playerRef?.current?.pause();

    setSelectedWord(filterWord(word));
    setShowWordDefinitionModal(true);
  };

  const filterWord = (word: string) => {
    let filterdWord = word.toLowerCase();
    filterdWord = filterdWord.replaceAll('-', '');
    filterdWord = filterdWord.replaceAll('_', '');
    filterdWord = filterdWord.replaceAll(',', '');
    filterdWord = filterdWord.replaceAll('.', '');
    filterdWord = filterdWord.replaceAll('?', '');

    return filterdWord;
  };

  const convertTime = (time: string): number => {
    const second = new SubtitleTime(time, 'srt');
    return second.to('second');
  };

  const handleResume = () => {
    setShowWordDefinitionModal(false);
  };

  if (Subtitle.length === 0) return <> loading... </>;
  return (
    <Wrapper>
      <Player options={options} onReady={handleReady} />
      <SubTitleTextDisplay show={ShowCurrentSubtitleText}>
        {CurrentSubtitleText}
      </SubTitleTextDisplay>
      <WordDefinition
        show={ShowWordDefinitionModal}
        word={SelectedWord}
        onResume={handleResume}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 3;
`;

const SubTitleTextDisplay = styled.p<{show: boolean}>`
  position: fixed;
  bottom: 50px;
  left: 50%;
  z-index: 3;
  background: rgba(0, 0, 0, 0.6);
  transform: translateY(40%) translateX(-50%);
  font-size: 26px;
  padding: 5px 13px;
  border-radius: 4px;
  opacity: 0;
  color: #fff;
  text-align: center;
  pointer-events: none;
  will-change: transform, opacity;

  transition: all ease-in-out 0.13s;

  ${({show}) =>
    show &&
    `
    pointer-events: auto ;
    opacity: 1;
    transform: translateY(0%) translateX(-50%);
  `}

  &:hover {
    span {
      color: rgba(255, 255, 255, 0.6);
    }
  }

  div[id^='line'] {
    padding-top: 5px;
    display: block;
    margin: 3px 0;

    &.bold {
      font-family: VazirBold;
      font-weight: 600;
    }

    &.italic {
      font-style: italic;
    }
  }

  span[id^='word'] {
    padding: 0 3.4px;
    position: relative;
    transition: all ease-in-out 0.2s;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      width: 100%;
      background: #fff;
      height: 3px;
      left: 0;
      opacity: 0;
      transition: all ease-in-out 0.7s;
    }

    &:hover {
      color: rgba(255, 255, 255, 1);
      cursor: pointer;

      &::after {
        opacity: 1;
      }
    }
  }
`;

export default VideoSession;
