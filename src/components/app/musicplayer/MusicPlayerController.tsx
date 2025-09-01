import { FaSlash } from "react-icons/fa";
import Slider from "../slider/Slider";

import {
  BiFastForward,
  BiPause,
  BiPlay,
  BiRepeat,
  BiShuffle,
  BiSkipNext,
  BiSkipPrevious,
} from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { useMusicPlayerStore } from "@/zustand/store";
import { PiDotsThree, PiNumberOne } from "react-icons/pi";
import {
  Fullscreen,
  Volume,
  Volume1,
  Volume1Icon,
  Volume2,
} from "lucide-react";
import MusicImage from "@/assets/music/music.jpeg";

const MusicPlayerController = () => {
  //   Global states
  const isPause = useMusicPlayerStore((store) => store.isPause);
  const isRepeatOn = useMusicPlayerStore((store) => store.isRepeatOn);
  const songDuration = useMusicPlayerStore((store) => store.songDuration);
  const isShuffleOn = useMusicPlayerStore((store) => store.isShuffleOn);
  const currentSong = useMusicPlayerStore((store) => store.currentSong);
  const currentTime = useMusicPlayerStore((store) => store.currentTime);
  const elapsedTime = useMusicPlayerStore((store) => store.elapsedTime);
  const seekPosition = useMusicPlayerStore((store) => store.seekPosition);
  const volumeLevel = useMusicPlayerStore((store) => store.volumeLevel);
  const timeLength = useMusicPlayerStore((store) => store.timeLength);
  const finishedPlay = useMusicPlayerStore((store) => store.finishedPlay);

  const files = useMusicPlayerStore((store) => store.files);
  const currentId = useMusicPlayerStore((store) => store.currentId);
  const setIsVolumeBarOpen = useMusicPlayerStore(
    (store) => store.setIsVolumeBarOpen
  );
  const setToggleMiniPlayer = useMusicPlayerStore(
    (store) => store.setToggleMiniPlayer
  );
  const setIsRepeatOn = useMusicPlayerStore((store) => store.setIsRepeatOn);
  const setIsPause = useMusicPlayerStore((store) => store.setIsPause);
  const setIsShuffleOn = useMusicPlayerStore((store) => store.setIsShuffleOn);
  const setSongDuration = useMusicPlayerStore((store) => store.setSongDuration);
  const setVolumeLevel = useMusicPlayerStore((store) => store.setVolumeLevel);
  const setCurrentTime = useMusicPlayerStore((store) => store.setCurrentTime);
  const setElapsedTime = useMusicPlayerStore((store) => store.setElapsedTime);
  const setSeekPosition = useMusicPlayerStore((store) => store.setSeekPosition);
  const setTimeLength = useMusicPlayerStore((store) => store.setTimeLength);
  const setAudioRef = useMusicPlayerStore((store) => store.setAudioRef);
  const setFinishedPlay = useMusicPlayerStore((store) => store.setFinishedPlay);
  const setCurrentId = useMusicPlayerStore((store) => store.setCurrentId);
  const setMetadata = useMusicPlayerStore((store) => store.setMetadata);
  const setCurrentPlayingSong = useMusicPlayerStore(
    (store) => store.setCurrentPlayingSong
  );
  //   Global states ends here...!

  const iconSize = 30;
  const fallback = 22;
  const mainIcons = 50;

  const handleOnClick = (option: string) => {
    switch (option) {
      case "Play/Pause": {
        setIsPause();
        break;
      }
      case "Shuffle": {
        window.electronAPI.saveShuffle(!isShuffleOn);
        setIsShuffleOn(!isShuffleOn);
        break;
      }
      case "Repeat": {
        window.electronAPI.saveRepeat(!isRepeatOn);
        setIsRepeatOn(!isRepeatOn);
        break;
      }
      case "Volume": {
        setIsVolumeBarOpen();
        break;
      }
      case "FullScreen": {
        window.electronAPI.toggleFullscreen();
        break;
      }
      case "MiniPlayer": {
        window.electronAPI.toggleMiniplayer();
        setToggleMiniPlayer(true);
        break;
      }
    }
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [songURL, setSongURL] = useState<string | null>(null);
  const [length, setLength] = useState<number>();
  const [count, setCount] = useState<number>(0);

  async function showMetadata(filePath: string) {
    if (!filePath) return;

    try {
      const metadata = await window.electronAPI.getMetadata(filePath);

      setMetadata(metadata);
    } catch (err) {
      console.error("Failed to get metadata:", err);
    }
  }
 
  useEffect(() => {
    try {
      if (!audioRef.current) return;

      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaElementSource(audioRef.current);
      const gainNode = audioCtx.createGain();

      // Set gain value; 1 is normal, >1 will boost
      gainNode.gain.value = 1; // boost 2x

      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Clean up
      return () => {
        gainNode.disconnect();
        source.disconnect();
      };
    } catch (error) {
      console.log(error);
    }
  }, [audioRef.current]);

  // load user preferences at start-up
  useEffect(() => {
    window.electronAPI.getVolume().then((v) => {
      setVolumeLevel(v);
    });

    window.electronAPI.getShuffle().then((v) => {
      setIsShuffleOn(v);
    });
    window.electronAPI.getRepeat().then((v) => {
      // console.log(v);
      setIsRepeatOn(v);
    });
  }, []);

  //handle pause
  useEffect(() => {
    try {
      if (!audioRef.current) return;
      setAudioRef(audioRef.current);
      if (isPause && audioRef.current) audioRef.current.pause();
      if (!isPause && audioRef.current) audioRef.current.play();
    } catch (error) {
      console.log(error);
    }
  }, [isPause, songURL]);

  // Handle seeking
  useEffect(() => {
    if (!audioRef.current) return;
    const position = (seekPosition / 100) * songDuration;
    audioRef.current.currentTime = position;
    handleTimeUpdate(position);
  }, [seekPosition, songDuration]);

  // Handle volume in real time
  useEffect(() => {
    if (!audioRef.current) return;
    const clamp = Math.max(0, Math.min(volumeLevel / 100, 1));
    audioRef.current.volume = clamp;
  }, [volumeLevel, songURL]);

  // create new url object  from song file with meta data
  useEffect(() => {
    if (currentSong) {
      showMetadata(currentSong.path);

      const url = URL.createObjectURL(currentSong);
      useMusicPlayerStore.setState({ isPause: false });
      useMusicPlayerStore.setState({ elapsedTime: { minutes: 0, seconds: 0 } });
      setSeekPosition(0);
      setCount(0);
      setFinishedPlay(false);
      setSongURL(url);
      // cleanup previous object URL
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [currentSong]);

  // /play next song or stop song when finished
  useEffect(() => {
    if (count > 0) {
      return;
    }
    if (currentTime === songDuration) {
      if (songDuration) {
        setCount(count + 1);
        setFinishedPlay(true);
        if (!isShuffleOn) {
          setIsPause();
        }
      }
    }
  }, [currentTime, songDuration, count]);

  // use shuffle method
  useEffect(() => {
    if (!finishedPlay) return;
    if (finishedPlay) {
      if (isShuffleOn) {
        ShuffleMethod();
      } else {
        const id = Math.min(currentId + 1, files.length - 1);
        setCurrentPlayingSong(files[id]);

        setCurrentId(id);
      }
    }
  }, [finishedPlay]);

  // set music ( audio ) length to percentage
  useEffect(() => {
    if (!currentTime) return;
    if (!songDuration) return;

    const clamp = (currentTime / songDuration) * 100;
    setLength(clamp);
  }, [currentTime, songDuration]);

  // set time length of the music ( audio ) to a real minutes and seconds ( time )
  useEffect(() => {
    if (!songDuration) return;
    const minutes = Math.floor(songDuration / 60);
    const seconds = Math.floor(songDuration % 60);
    setTimeLength({ minutes, seconds });
  }, [songDuration]);

  // set Elapsed Time of the music ( audio ) in real minutes and seconds
  useEffect(() => {
    if (!currentTime) return;
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    setElapsedTime({ minutes, seconds });
  }, [currentTime]);

  // shuffle method to play song as shuffle
  const ShuffleMethod = () => {
    if (!isShuffleOn) return;
    if (isShuffleOn) {
      if (isRepeatOn && audioRef.current) {
        audioRef.current.src = URL.createObjectURL(files[currentId]);
        audioRef.current.play();
        setCurrentPlayingSong(files[currentId]);
        return;
      }
      const id = Math.floor(Math.random() * files.length - 1);
      setCurrentId(id);
      setCurrentPlayingSong(files[id]);
      return;
    }
  };

  // load meta data of a song
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const d = audioRef.current.duration;
      if (!isNaN(d)) {
        setSongDuration(d);
      }
    }
  };

  // handle seek time update in real time
  const handleTimeUpdate = (seek: number | null) => {
    if (audioRef.current) {
      if (seek) {
        setCurrentTime(seek);
      } else {
        setCurrentTime(audioRef.current.currentTime);
      }
    }
  };

  return (
    <div className="">
      <div className="p-1 flex justify-start items-center">
        <p className="text-xs">
          {elapsedTime.minutes}:
          {elapsedTime.seconds.toString().padStart(2, "0")}
        </p>
        <Slider externalPosition={length} purpose={"seek"} />
        <p className="text-xs">
          {timeLength.minutes}:{timeLength.seconds.toString().padStart(2, "0")}
        </p>
      </div>
      <div className="p-5 flex justify-between px-5 relative  items-center ">
        {/* start div */}
        <StartDiv />

        {/* audio component */}
        {songURL && (
          <audio
            ref={audioRef}
            src={songURL}
            onTimeUpdate={() => handleTimeUpdate(null)}
            onLoadedMetadata={handleLoadedMetadata}
          />
        )}

        {/* center div  */}
        <CenterDiv
          fallback={fallback}
          iconSize={iconSize}
          mainIcons={mainIcons}
          handleOnClick={handleOnClick}
        />
        {/* end div  */}
        <EndDiv
          fallback={fallback}
          iconSize={iconSize}
          handleOnClick={handleOnClick}
        />
      </div>
    </div>
  );
};
export default MusicPlayerController;

const StartDiv = () => {
  const metaData = useMusicPlayerStore((store) => store.metaData);
  const currentSong = useMusicPlayerStore((store) => store.currentSong);

  return (
    <div className=" flex items-center gap-2  flex-shrink-0">
      {/* <div className="absolute -top-64 left-5 h-60 w-60 border rounded-md border-gray-200 shadow-md">
                      <img
                          src={metadata?.picture ? metadata.picture : MusicImage}
                          className="h-full w-fit flex-shrink-0 rounded-md"
                          alt="Logo"
                      />
                  </div> */}
      <div className="left-5 h-16 w-16 border rounded-md border-gray-200 shadow-md">
        <img
          src={metaData?.picture ? metaData.picture : MusicImage}
          className="h-full w-fit flex-shrink-0 rounded-md"
          alt="Logo"
        />
      </div>
      <div className="transition-all w-32 sm:w-32 md:w-44  lg:w-[18rem] xl:w-[25rem] truncate">
        <h1 className="text-xl">{currentSong?.name}</h1>
        <p className="">{metaData?.artist ? metaData.artist : null}</p>
      </div>
    </div>
  );
};
interface CenterDivProps {
  fallback: number;
  iconSize: number;
  mainIcons: number;
  handleOnClick: (option: string) => void;
}
const CenterDiv = ({ iconSize, handleOnClick, mainIcons }: CenterDivProps) => {
  const isRepeatOn = useMusicPlayerStore((store) => store.isRepeatOn);
  const isPause = useMusicPlayerStore((store) => store.isPause);
  const isShuffleOn = useMusicPlayerStore((store) => store.isShuffleOn);
  const currentSong = useMusicPlayerStore((store) => store.currentSong);
  const files = useMusicPlayerStore((store) => store.files);
  const audioRef = useMusicPlayerStore((store) => store.audioRef);
  const currentId = useMusicPlayerStore((store) => store.currentId);

  const setCurrentId = useMusicPlayerStore((store) => store.setCurrentId);
  const setCurrentPlayingSong = useMusicPlayerStore(
    (store) => store.setCurrentPlayingSong
  );

  const mainOption = [
    { name: "Shuffle", icon: <BiShuffle size={iconSize} /> },
    { name: "Previous", icon: <BiSkipPrevious size={iconSize} /> },
    { name: "SkipBack", icon: <BiFastForward size={iconSize} /> },
    { name: "Play/Pause", icon: <BiPlay size={mainIcons} /> },
    { name: "SkipForward", icon: <BiFastForward size={iconSize} /> },
    { name: "Next", icon: <BiSkipNext size={iconSize} /> },
    { name: "Repeat", icon: <BiRepeat size={iconSize} /> },
  ];

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-1 md:gap-1 justify-end items-center ">
      {/* <div className="flex justify-center items-center gap-3"> */}

      {mainOption.map((option, index) => {
        const renderPlayPause = () =>
          isPause ? (
            <span className="">{option.icon}</span>
          ) : (
            <BiPause size={mainIcons} />
          );

        const renderShuffle = () =>
          isShuffleOn ? (
            <span className="hidden md:flex relative">{option.icon}</span>
          ) : (
            <div className="hidden md:flex relative">
              <span>{option.icon}</span>
              <FaSlash size={25} className="absolute left-0 top-0 -rotate-12" />
            </div>
          );

        const renderRepeat = () =>
          isRepeatOn ? (
            <span className="relative hidden md:flex ">
              {option.icon}
              <PiNumberOne className="bg-gray-500 text-white rounded-full absolute top-0 right-0" />
            </span>
          ) : (
            <div className="hidden md:flex relative">
              <span>{option.icon}</span>
              <FaSlash size={25} className="absolute left-0 top-0 -rotate-12" />
            </div>
          );
        const renderSkipBack = () => (
          <div
            className="hidden md:flex relative"
            onClick={(e) => {
              e.stopPropagation();
              if (audioRef) {
                const newSeek = Math.max(audioRef.currentTime - 2, 0);
                audioRef.currentTime = newSeek;
              }
            }}
          >
            <span>{option.icon}</span>
          </div>
        );
        const renderSkipForward = () => (
          <div
            className="hidden md:flex relative"
            onClick={(e) => {
              e.stopPropagation();
              if (audioRef) {
                const newSeek = Math.min(
                  audioRef.currentTime + 2,
                  audioRef.duration
                );
                audioRef.currentTime = newSeek;
              }
            }}
          >
            <span>{option.icon}</span>
          </div>
        );
        const renderPrevious = () => (
          <div
            className="flex relative"
            onClick={(e) => {
              e.stopPropagation();
              if (isShuffleOn) {
                const id = Math.floor(Math.random() * files.length - 1);
                setCurrentId(id);
                setCurrentPlayingSong(files[id]);
              } else {
                const id = Math.min(
                  Math.max(currentId - 1, 0),
                  files.length - 1
                );
                setCurrentId(id);
                setCurrentPlayingSong(files[id]);
              }
            }}
          >
            <span>{option.icon}</span>
          </div>
        );
        const renderNext = () => (
          <div
            className="flex relative"
            onClick={(e) => {
              if (isShuffleOn) {
                const id = Math.floor(Math.random() * files.length - 1);
                setCurrentId(id);
                setCurrentPlayingSong(files[id]);
              } else {
                e.stopPropagation();
                const id = Math.min(currentId + 1, files.length - 1);
                setCurrentId(id);
                setCurrentPlayingSong(files[id]);
              }
            }}
          >
            <span>{option.icon}</span>
          </div>
        );

        const renderDefault = () => <span>{option.icon}</span>;
        let content;
        switch (option.name) {
          case "Play/Pause":
            content = renderPlayPause();
            break;
          case "Shuffle":
            content = renderShuffle();
            break;
          case "Repeat":
            content = renderRepeat();
            break;
          case "SkipBack":
            content = renderSkipBack();
            break;
          case "SkipForward":
            content = renderSkipForward();
            break;
          case "Next":
            content = renderNext();
            break;
          case "Previous":
            content = renderPrevious();
            break;
          default:
            content = renderDefault();
        }

        return (
          <div
            key={index}
            className={`relative items-center ${
              option.name === "SkipBack" || option.name === "SkipBack"
                ? "-scale-x-100" // mirror only SkipBack
                : "scale-x-100"
            }`}
            onClick={() => {
              // prevent event bubbling
              if (
                option.name !== "SkipBack" &&
                option.name !== "SkipForward" &&
                option.name !== "Next" &&
                option.name !== "Previous"
              ) {
                handleOnClick(option.name);
              }
            }}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

interface EndDivProps {
  fallback: number;
  iconSize: number;
  handleOnClick: (option: string) => void;
}
const EndDiv = ({ fallback, iconSize, handleOnClick }: EndDivProps) => {
  const isVolumeBarOpen = useMusicPlayerStore((store) => store.isVolumeBarOpen);
  const volumeLevel = useMusicPlayerStore((store) => store.volumeLevel);
  const volumeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        volumeRef.current &&
        !volumeRef.current.contains(event.target as Node)
      ) {
        useMusicPlayerStore.setState({ isVolumeBarOpen: false });
      } else {
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const secondaryOptions = [
    { name: "Volume", icon: <Volume1Icon size={fallback} /> },
    { name: "FullScreen", icon: <Fullscreen size={fallback} /> },
    // { name: "MiniPlayer", icon: <Minimize2Icon size={fallback} /> },
    { name: "Settings", icon: <PiDotsThree size={iconSize} /> },
  ];

  return (
    <div className="flex justify-center items-center gap-2 md:gap-5">
      {secondaryOptions.map((option, index) => {
        const renderVolume = () => (
          <div ref={volumeRef} className="relative">
            {volumeLevel >= 75 ? (
              <span onClick={() => handleOnClick(option.name)}>
                <Volume2 />
              </span>
            ) : volumeLevel > 0 ? (
              <span onClick={() => handleOnClick(option.name)}>
                <Volume1 />
              </span>
            ) : volumeLevel >= 0 ? (
              <span onClick={() => handleOnClick(option.name)}>
                <Volume />
              </span>
            ) : (
              <div></div>
            )}
            {isVolumeBarOpen && (
              <div className="absolute -top-10 -left-28  md:-left-20 w-52 h-8 bg-gray-200 flex justify-center items-center rounded-sm">
                <Slider purpose="volume" />
              </div>
            )}
          </div>
        );
        const renderFullScreen = () => (
          <div className="relative hidden md:block">
            <span onClick={() => handleOnClick(option.name)}>
              {option.icon}
            </span>
          </div>
        );
        const renderMiniPlayer = () => (
          <div className="relative ">
            <span onClick={() => handleOnClick(option.name)}>
              {option.icon}
            </span>
          </div>
        );

        const renderDefault = () => (
          <span onClick={() => handleOnClick(option.name)}>{option.icon}</span>
        );

        let content;
        switch (option.name) {
          case "Volume":
            content = renderVolume();
            break;
          case "FullScreen":
            content = renderFullScreen();
            break;
          case "MiniPlayer":
            content = renderMiniPlayer();
            break;
          default:
            content = renderDefault();
        }

        return (
          <div key={index} className="items-center">
            {content}
          </div>
        );
      })}
    </div>
  );
};
