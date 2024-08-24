'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Slider, Progress } from '@nextui-org/react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const VideoTrimmer: React.FC = () => {
  const [video, setVideo] = useState<File | null>(null);
  const [trimmedVideo, setTrimmedVideo] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSliderChanging, setIsSliderChanging] = useState<boolean>(false);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const ffmpegInstance = new FFmpeg();
      ffmpegInstance.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd';
      await ffmpegInstance.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          'text/javascript',
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          'application/wasm',
        ),
      });

      setFFmpeg(ffmpegInstance);
    };

    loadFFmpeg();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setVideo(file);
      setTrimmedVideo(null);

      setStartTime(0);
      setEndTime(10);

      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.onloadedmetadata = () => {
        setVideoDuration(videoElement.duration);
        setEndTime(Math.min(10, videoElement.duration));
      };
      videoElement.src = URL.createObjectURL(file);
    }
  };

  const handleTrim = async () => {
    if (!video || !ffmpeg) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      await ffmpeg.writeFile('input.mp4', await fetchFile(video));

      await ffmpeg.exec([
        '-i',
        'input.mp4',
        '-ss',
        startTime.toString(),
        '-t',
        (endTime - startTime).toString(),
        '-c',
        'copy',
        'output.mp4',
      ]);

      const data = await ffmpeg.readFile('output.mp4');

      let blobData: Uint8Array;
      if (data instanceof Uint8Array) {
        blobData = data;
      } else {
        blobData = new TextEncoder().encode(data);
      }

      const url = URL.createObjectURL(
        new Blob([blobData], { type: 'video/mp4' }),
      );
      setTrimmedVideo(url);
    } catch (error) {
      console.error('Error during video trimming:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSliderChange = useCallback((value: number[]) => {
    const [start, end] = value;
    setStartTime(start);
    setEndTime(end);
  }, []);

  const handleSliderChangeStart = useCallback(() => {
    setIsSliderChanging(true);
  }, []);

  const handleSliderChangeEnd = useCallback(() => {
    setIsSliderChanging(false);
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
    }
  }, [startTime]);

  useEffect(() => {
    if (!isSliderChanging && videoRef.current) {
      videoRef.current.currentTime = startTime;
    }
  }, [startTime, isSliderChanging]);

  return (
    <div className='space-y-4'>
      <input
        type='file'
        accept='video/*'
        onChange={handleFileChange}
        className='mb-4'
      />

      {video && (
        <>
          <video
            ref={videoRef}
            src={URL.createObjectURL(video)}
            controls
            className='w-full max-w-md'
          />

          <div className='flex items-center space-x-2'>
            <span>Trim:</span>
            <Slider
              label='Trim Video'
              step={0.1}
              minValue={0}
              maxValue={Math.max(videoDuration, 10)}
              value={[startTime, endTime]}
              onChange={(it) => handleSliderChange(it as number[])}
              onChangeEnd={handleSliderChangeEnd}
              className='max-w-md'
            />
            <span>
              {startTime.toFixed(1)}s - {endTime.toFixed(1)}s
            </span>
          </div>

          <Button onClick={handleTrim} disabled={isProcessing || !ffmpeg}>
            {isProcessing ? 'Processing...' : 'Trim Video'}
          </Button>

          {isProcessing && <Progress value={progress} className='max-w-md' />}
        </>
      )}

      {trimmedVideo && (
        <div className='mt-4'>
          <h3 className='text-lg font-semibold'>Trimmed Video:</h3>
          <video src={trimmedVideo} controls className='w-full max-w-md' />
        </div>
      )}
    </div>
  );
};

export default VideoTrimmer;
