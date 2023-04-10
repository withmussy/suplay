import React, {useEffect} from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hotkeys/videojs.hotkeys.min.js';

interface PlayerType {
  options: videojs.PlayerOptions;
  onReady: (player: videojs.Player) => void;
}

const Player = (props: PlayerType) => {
  const videoRef = React.useRef(null);
  const playerRef: React.MutableRefObject<null | videojs.Player> =
    React.useRef(null);

  const {onReady, options} = props;

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    if (playerRef.current) return;

    const player = videojs(videoElement, options, () => {
      playerRef.current = player;

      player.hotkeys({
        volumeStep: 0.1,
        seekStep: 1.5,
        enableFullscreen: false,
        alwaysCaptureHotkeys: true,
        captureDocumentHotkeys: true,
      });

      onReady(player);
    });
  }, [videoRef]);

  const handlePlayPauseKey = (
    event: KeyboardEvent,
    player: videojs.Player,
  ) => {
    console.log(event.which)
    if( event.which === 32 ) return true;

    return false;
  };

  return <video ref={videoRef} className="video-js vjs-big-play-centered" />;
};

export default Player;
