import { Group, RingProgress, Text, rem } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import axios, { AxiosProgressEvent } from 'axios';
import { useEffect, useState } from 'react';

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
};

const toursUrl = //TODO: This should be an environment variable
  'http://lehakoe-virtual-tours.s3-website.eu-central-1.amazonaws.com/';

export default function TourInput({ value, onChange }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>();

  const handleFileUpload = async () => {
    if (file) {
      setProgress(0);
      try {
        const { url, fileName } = (
          await axios.get(`/api/virtualtours/upload-url`)
        ).data;

        await axios.put(url, file, {
          onUploadProgress: (e: AxiosProgressEvent) => {
            if (e.total) {
              setProgress((e.loaded / e.total) * 100);
            }
          },
        });
        if (fileName) {
          setProgress(0);
          onChange?.(`${toursUrl}${fileName.split('.')[0]}`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFile(null);
        setProgress(undefined);
      }
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);

  return (
    <Dropzone
      accept={[MIME_TYPES.zip]}
      onDrop={(files) => setFile(files[0])}
      onReject={(files) => console.log('rejected files', files)}
    >
      <Group
        justify='center'
        gap='xl'
        mih={220}
        style={{ pointerEvents: 'none' }}
      >
        <Dropzone.Accept>
          <IconUpload
            style={{
              width: rem(52),
              height: rem(52),
              color: 'var(--mantine-color-blue-6)',
            }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{
              width: rem(52),
              height: rem(52),
              color: 'var(--mantine-color-red-6)',
            }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            style={{
              width: rem(52),
              height: rem(52),
              color: 'var(--mantine-color-dimmed)',
            }}
            stroke={1.5}
          />
        </Dropzone.Idle>
        {progress ? (
          <RingProgress
            sections={[{ value: progress, color: 'blue' }]}
            thickness={2}
            label={
              <Text c='blue' ta='center' size='xl'>
                {progress ? `${progress.toFixed(0)}%` : '0%'}
              </Text>
            }
          />
        ) : (
          <div>
            <Text size='xl' inline>
              Drag or click to select tour file
            </Text>
            <Text size='sm' c='dimmed' inline mt={7}>
              Inside the zipped file the tour should be contained in a folder
            </Text>
          </div>
        )}
      </Group>
    </Dropzone>
  );
}
