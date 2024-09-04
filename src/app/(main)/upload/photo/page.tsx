'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getVideo } from '@/lib/utils/indexedDB';

export default function PreviewUpload() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedVideoName = localStorage.getItem('selectedVideoName');
    if (!storedVideoName) {
      router.push('/');
    } else {
      setVideoName(storedVideoName);
      loadVideo();
    }
  }, []);

  const loadVideo = async () => {
    try {
      const video = await getVideo('currentVideo');
      if (video) {
        const url = URL.createObjectURL(video);
        setVideoUrl(url);
      } else {
        console.error('No video found in storage');
        alert('No video found. Please select a video first.');
        router.push('/select-video');
      }
    } catch (error) {
      console.error('Error loading video:', error);
      alert('There was an error loading the video. Please try again.');
    }
  };

  if (!videoUrl || !videoName) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Preview Video</h1>
      <p>Selected video: {videoName}</p>
      <video
        src={videoUrl}
        controls
        style={{ maxWidth: '100%', maxHeight: '500px' }}
      >
        Your browser does not support the video tag.
      </video>
      {/* You can add your upload button and logic here */}
    </div>
  );
}
