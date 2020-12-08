import React, { useState, useEffect } from "react";

export const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [play, setPlay] = useState(false);
  const [reset, setReset] = useState(false);

  const playAudio = (bool) => setPlay(bool);
  const resetAudio = (bool) => setReset(bool);

  useEffect(() => {
    if (reset) {
      setPlay(false);
      audio.currentTime = 0;
      setReset(false);
      setPlay(true);
    }
  }, [reset]);

  useEffect(() => {
    if (play) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [play]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlay(false));
    return () => {
      audio.removeEventListener("ended", () => setPlay(false));
    };
  }, []);

  return [playAudio, resetAudio, audio];
};
