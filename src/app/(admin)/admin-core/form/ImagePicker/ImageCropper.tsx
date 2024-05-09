import React, { useState, useTransition } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop';
import { Box, Button, Group, Slider, Stack } from '@mantine/core';
import getCroppedImg from './cropImage';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/config/firebase';

type Props = {
  imageUri: string;
  uploadComplete: (url: string) => void;
  aspectRatio?: number;
};

export default function ImageCropper({ aspectRatio = 4 / 3, ...props }: Props) {
  const { imageUri, uploadComplete } = props;
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isPending, startTransition] = useTransition();

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    console.log(croppedArea, croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    if (!croppedAreaPixels) {
      return;
    }
    try {
      startTransition(async () => {
        const cropped = await getCroppedImg(imageUri, croppedAreaPixels, 0);
        if (cropped) {
          const url = await uploadImage(cropped, imageUri);
          uploadComplete(url);
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Stack>
      <Box pos='relative' w='100%' h={400}>
        <Cropper
          image={imageUri}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          showGrid={true}
        />
      </Box>
      <Slider
        value={zoom}
        min={1}
        max={10}
        aria-labelledby='Zoom'
        onChange={(e) => setZoom(e)}
      />
      <Group justify='end'>
        <Button
          onClick={showCroppedImage}
          variant='default'
          loading={isPending}
        >
          Crop
        </Button>
      </Group>
    </Stack>
  );
}

async function uploadImage(croppedImage: string, imageUri: string) {
  const file = await fetch(croppedImage).then((res) => res.blob());
  const path = pathFromUrl(imageUri as string);
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

function pathFromUrl(url: string) {
  const start = url.lastIndexOf('/') + 1;
  const end = url.indexOf('?');
  const path = url.substring(start, end);
  return path.replace(/%2F/g, '/');
}
