'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Slider, Progress } from '@nextui-org/react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const VideoTrimmer = () => {
  const [video, setVideo] = useState<File | null>(null);
  const [trimmedVideo, setTrimmedVideo] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      setVideo(event.target.files[0]);
      setTrimmedVideo(null);
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
        '10',
        '-c',
        'copy',
        'output.mp4',
      ]);

      const data = await ffmpeg.readFile('output.mp4');
      const url = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }));
      setTrimmedVideo(url);
    } catch (error) {
      console.error('Error during video trimming:', error);
    } finally {
      setIsProcessing(false);
    }
  };

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
            <span>Start Time:</span>
            <Slider
              label='Trim Video'
              step={0.1}
              maxValue={10}
              minValue={0}
              value={[startTime, 10]}
              onChange={(value) => setStartTime(Number(value))}
              className='max-w-md'
            />
            <span>{startTime.toFixed(1)}s</span>
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
