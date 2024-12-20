'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Slider } from '@nextui-org/react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

interface VideoEditorProps {
  videoFile: File | null;
  onNext: (trimmedUrl: string) => void;
}

interface Thumbnail {
  url: string;
  time: number;
}

const MAX_DURATION = 30;

export default function VideoEditor({ videoFile, onNext }: VideoEditorProps) {
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(MAX_DURATION);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [isSliderChanging, setIsSliderChanging] = useState<boolean>(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastDraggedHandle = useRef<'start' | 'end' | null>(null);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const ffmpegInstance = new FFmpeg();

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

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setCurrentVideoUrl(url);
    }
  }, [videoFile]);

  useEffect(() => {
    if (currentVideoUrl) {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.onloadedmetadata = () => {
        setVideoDuration(videoElement.duration);
        setEndTime(Math.min(MAX_DURATION, videoElement.duration));
      };
      videoElement.src = currentVideoUrl;
    }
  }, [currentVideoUrl]);

  const generateThumbnails = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const videoAspectRatio = video.videoWidth / video.videoHeight;
    canvas.width = 100;
    canvas.height = canvas.width / videoAspectRatio;

    const numberOfThumbnails = 10;
    const newThumbnails: Thumbnail[] = [];

    for (let i = 0; i < numberOfThumbnails; i++) {
      const time = (videoDuration * i) / numberOfThumbnails;
      video.currentTime = time;

      await new Promise((resolve) => {
        video.onseeked = resolve;
      });

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnailUrl = canvas.toDataURL('image/jpeg');
      newThumbnails.push({ url: thumbnailUrl, time });
    }

    setThumbnails(newThumbnails);
    video.currentTime = startTime;
  }, [videoDuration, startTime]);

  useEffect(() => {
    if (videoDuration > 0 && videoRef.current) {
      generateThumbnails();
    }
  }, [videoDuration, generateThumbnails]);

  const handleTrim = async () => {
    if (!currentVideoUrl || !ffmpeg) return;

    setIsProcessing(true);

    try {
      await ffmpeg.writeFile('input.mp4', await fetchFile(currentVideoUrl));

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

      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.onloadedmetadata = () => {
        const trimmedDuration = videoElement.duration;
        setVideoDuration(trimmedDuration);
        setStartTime(0);
        setEndTime(Math.min(MAX_DURATION, trimmedDuration));
      };
      videoElement.src = url;

      setCurrentVideoUrl(url);
    } catch (error) {
      console.error('Error during video trimming:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSliderChange = useCallback(
    (value: number[]) => {
      let [start, end] = value;
      const currentDuration = endTime - startTime;

      if (end - start > MAX_DURATION) {
        if (!lastDraggedHandle.current) {
          const startDelta = Math.abs(start - startTime);
          const endDelta = Math.abs(end - endTime);
          lastDraggedHandle.current = endDelta > startDelta ? 'end' : 'start';
        }

        if (lastDraggedHandle.current === 'end') {
          start = end - MAX_DURATION;
        } else {
          end = start + MAX_DURATION;
        }
      } else {
        lastDraggedHandle.current = null;
      }

      setStartTime(start);
      setEndTime(end);
    },
    [startTime, endTime],
  );

  const handleSliderChangeEnd = useCallback(() => {
    setIsSliderChanging(false);
    lastDraggedHandle.current = null;
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
    }
  }, [startTime]);

  useEffect(() => {
    if (!isSliderChanging && videoRef.current) {
      videoRef.current.currentTime = startTime;
    }
  }, [startTime, isSliderChanging]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= endTime) {
      videoRef.current.currentTime = startTime;
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
    }
  };

  const handleNext = async () => {
    await handleTrim();
    onNext(currentVideoUrl || '');
  };

  return (
    <div className='grid gap-5'>
      {currentVideoUrl && (
        <>
          <video
            ref={videoRef}
            src={currentVideoUrl}
            controls
            className='w-full md:h-[35vh]'
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
          />

          <div className='space-y-2'>
            <Slider
              label='Trim Video'
              step={1}
              size='sm'
              minValue={0}
              maxValue={videoDuration}
              value={[startTime, endTime]}
              onChange={(it) => handleSliderChange(it as number[])}
              onChangeEnd={handleSliderChangeEnd}
              className='w-full'
            />

            <div className='relative h-[50px] w-full overflow-hidden rounded-lg bg-gray-100'>
              <div className='absolute inset-0 flex'>
                {thumbnails.map((thumbnail, index) => (
                  <div
                    key={index}
                    className='h-full flex-1'
                    style={{
                      backgroundImage: `url(${thumbnail.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <canvas ref={canvasRef} className='hidden' />

          <div className='flex justify-end gap-4'>
            <Button
              onClick={handleTrim}
              isLoading={isProcessing}
              isDisabled={isProcessing || !ffmpeg}
              color='primary'
              variant='bordered'
            >
              {isProcessing ? 'Processing...' : 'Trim Video'}
            </Button>
            <Button
              color='primary'
              onClick={handleNext}
              isDisabled={isProcessing || !ffmpeg}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
