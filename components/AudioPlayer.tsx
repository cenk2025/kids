
import React, { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  base64Data: string;
  onEnded?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ base64Data, onEnded }) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const playAudio = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        const ctx = audioContextRef.current;
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const dataInt16 = new Int16Array(bytes.buffer);
        const frameCount = dataInt16.length;
        const buffer = ctx.createBuffer(1, frameCount, 24000);
        const channelData = buffer.getChannelData(0);
        
        for (let i = 0; i < frameCount; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = onEnded || null;
        source.start(0);
      } catch (err) {
        console.error("Playback failed", err);
      }
    };

    playAudio();
  }, [base64Data]);

  return null;
};

export default AudioPlayer;
