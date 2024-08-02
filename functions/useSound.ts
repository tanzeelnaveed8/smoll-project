import { Audio } from "expo-av";
import { useEffect, useRef } from "react";

export const useSound = () => {
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    loadSound();
    return () => {
      unload();
    };
  }, []);

  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/audio/message.mp3")
      );
      soundRef.current = sound;
    } catch (error) {
      console.error("Error loading sound", error);
    }
  };

  const unload = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }
  };

  const play = async (type: "message") => {
    if (soundRef.current) {
      try {
        await soundRef.current.replayAsync();
      } catch (error) {
        console.error("Error playing sound", error);
      }
    }
  };

  return {
    play,
  };
};
