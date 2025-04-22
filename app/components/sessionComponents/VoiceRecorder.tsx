"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/app/contexts/SessionContext";
import { Translate } from "../global/Translate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NUM_BARS = 8;

const VoiceRecorder: React.FC = () => {
  const [recordingState, setRecordingState] = useState<
    "idle" | "recording" | "paused" | "stopped"
  >("idle");
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [waveData, setWaveData] = useState<number[]>(Array(NUM_BARS).fill(15));
  const [recordingTime, setRecordingTime] = useState<number>(0);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const animationFrameRef = useRef<number | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const { setIsModalOpen, nextStep, updateSessionData } = useSession();

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const mics = devices.filter((device) => device.kind === "audioinput");
      setAudioDevices(mics);
      if (mics.length > 0) {
        setSelectedDeviceId(mics[0].deviceId);
      }
    });
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
      },
    });

    mediaRecorder.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
      const file = new File(audioChunks.current, "audio.wav", {
        type: "audio/wav",
      });
      updateSessionData({ recording: file });
      audioChunks.current = [];
    };

    mediaRecorder.current.start();
    setRecordingState("recording");
    setRecordingTime(0);
    startTimer();

    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    sourceRef.current.connect(analyserRef.current);
    analyserRef.current.fftSize = 64;

    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    startWaveAnimation();
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
    setRecordingState("stopped");
    stopWaveAnimation();
    stopTimer();
    mediaRecorder.current?.stream.getTracks().forEach((track) => track.stop());
    nextStep();
  };

  const pauseRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.pause();
    }
    setRecordingState("paused");
    stopWaveAnimation();
    stopTimer();
  };

  const resumeRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.resume();
    }
    setRecordingState("recording");
    startWaveAnimation();
    startTimer();
  };

  const startWaveAnimation = () => {
    const MAX_BAR_HEIGHT = 100;
    const MIN_BAR_HEIGHT = 10;
    const GAIN = 1; // More aggressive gain for voice peaks

    const animate = () => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        const segmentSize = Math.floor(dataArrayRef.current.length / NUM_BARS);

        const bars = Array.from({ length: NUM_BARS }, (_, i) => {
          const index = i * segmentSize;
          const value = dataArrayRef.current![index];
          let normalized = value / 255;
          normalized = Math.min(1, normalized * GAIN);
          return (
            normalized * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT) + MIN_BAR_HEIGHT
          );
        });

        //sort in an order that heigher values are in center and lower values are at the edges
        setWaveData(bars);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const stopWaveAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setWaveData(Array(NUM_BARS).fill(15));
  };

  const startTimer = () => {
    stopTimer();
    timerInterval.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
  };

  useEffect(() => {
    return () => {
      stopWaveAnimation();
      stopTimer();
      audioContextRef.current?.close();
      analyserRef.current = null;
      sourceRef.current = null;
      audioContextRef.current = null;
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        setIsModalOpen(false);
        setRecordingState("idle");
        updateSessionData({});
      }}
    >
      <DialogContent className="mx-auto bg-white w-[494px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-[28px] text-[#2B3674] text-center font-semibold">
            <Translate>Recording Session</Translate>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center p-5 text-center">
          {recordingState === "idle" && (
            <div className="flex flex-col items-center">
              <p className="text-[16px] text-[#718096] mb-4">
                <Translate>Ready to start recording</Translate>
              </p>
              <div className="flex gap-2 py-[100px] h-28">
                {waveData.map((_, index) => (
                  <div
                    key={index}
                    className="w-3 gradient-bg h-3 rounded-full"
                  ></div>
                ))}
              </div>
              <button
                onClick={startRecording}
                className="bg-[#48BB78] flex items-center gap-2 text-white font-semibold text-[15px] px-[20px] py-[13px] rounded-[10px]"
              >
                <Image
                  src="/icons/microphone.svg"
                  width={20}
                  height={20}
                  alt="microphone"
                />
                <Translate>Start Session</Translate>
              </button>
            </div>
          )}

          {recordingState === "recording" && (
            <>
              <div className="flex py-[100px] h-28 items-center gap-2">
                {waveData.map((height, index) => (
                  <div
                    key={index}
                    className="w-3 gradient-bg rounded-full transition-all duration-100 max-h-[100px]"
                    style={{ height }}
                  />
                ))}
              </div>
              <p className="text-gray-500 mb-4">
                <Translate>Recording in progress</Translate>
              </p>
              <div className="flex flex-wrap justify-center gap-5">
                <button onClick={pauseRecording}>
                  <Image
                    src="/icons/pause.svg"
                    width={46}
                    height={46}
                    alt="pause"
                  />
                </button>
                <button
                  onClick={pauseRecording}
                  className="border border-[#E5E5E7] text-[#E53E3E] px-5 py-3 rounded-md flex items-center gap-2 font-semibold text-[15px]"
                >
                  <Image
                    src="/icons/reddot.svg"
                    width={10}
                    height={10}
                    alt="red"
                  />
                  <Translate>Stop Session</Translate>
                </button>
                <div className="flex items-center gap-2 text-[#718096] text-[16px]">
                  <Image
                    src="/icons/timer2.svg"
                    width={24}
                    height={24}
                    alt="timer"
                  />
                  {formatTime(recordingTime)}
                </div>
              </div>
            </>
          )}

          {recordingState === "paused" && (
            <>
              <div className="flex py-[100px] h-28 items-center gap-2">
                {waveData.map((_, index) => (
                  <div
                    key={index}
                    className="w-3 bg-[#2B3674] h-3 rounded-full"
                  ></div>
                ))}
              </div>
              <p className="text-gray-500 mb-4">
                <Translate>Recording Paused</Translate>
              </p>
              <div className="flex flex-wrap justify-center gap-5">
                <button onClick={resumeRecording}>
                  <Image
                    src="/icons/play.svg"
                    width={46}
                    height={46}
                    alt="play"
                  />
                </button>
                <button
                  onClick={stopRecording}
                  className="border border-[#E5E5E7] text-[#E53E3E] px-5 py-3 rounded-md flex items-center gap-2 font-semibold text-[15px]"
                >
                  <Image
                    src="/icons/redsq.svg"
                    width={10}
                    height={10}
                    alt="stop"
                  />
                  <Translate>End Session</Translate>
                </button>
                <div className="flex items-center gap-2 text-[#718096] text-[16px]">
                  <Image
                    src="/icons/timer2.svg"
                    width={24}
                    height={24}
                    alt="timer"
                  />
                  {formatTime(recordingTime)}
                </div>
              </div>
            </>
          )}

          {audioDevices.length > 1 && (
            <Select
              value={selectedDeviceId || ""}
              onValueChange={(value) => setSelectedDeviceId(value)}
            >
              <SelectTrigger className="mt-4 border-none shadow-none text-sm">
                <SelectValue placeholder="Select a device" />
              </SelectTrigger>
              <SelectContent>
                {audioDevices.map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label ||
                      `Microphone ${device.deviceId.slice(0, 5)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceRecorder;
