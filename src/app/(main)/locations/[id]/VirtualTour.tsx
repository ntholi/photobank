import { tourViaCloudfront } from '@/lib/config/urls';
import React from 'react';

interface Props {
  url: string | undefined | null;
}

export default function VirtualTour({ url }: Props) {
  if (!url) return null;
  return (
    <div
      style={{
        position: 'relative',
        height: 0,
        paddingTop: '46.25%',
        width: '100%',
      }}
    >
      <iframe
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        src={`${tourViaCloudfront(url)}/index.htm`}
        name='TOUR NAME'
        width='100%'
        height='100%'
        frameBorder='0'
        allowFullScreen={true}
        allow='fullscreen; accelerometer; gyroscope; magnetometer; vr; xr; xr-spatial-tracking; autoplay; camera; microphone'
      ></iframe>
    </div>
  );
}
