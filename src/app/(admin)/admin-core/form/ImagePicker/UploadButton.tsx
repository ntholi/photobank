import { ActionIcon, Flex, RingProgress, Text } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import React from 'react';

type Props = {
  progress: number | null;
  disabled?: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export default function UploadButton({ progress, inputRef, disabled }: Props) {
  return (
    <Flex justify='center' align='center' h={'100%'} w={'100%'}>
      {progress && progress < 100 ? (
        <RingProgress
          sections={[{ value: progress, color: 'blue' }]}
          thickness={5}
          label={
            <Text c='blue' ta='center' size='xl'>
              {Math.round(progress)}%
            </Text>
          }
        />
      ) : (
        <ActionIcon
          variant='default'
          size='xl'
          disabled={disabled}
          onClick={() => inputRef?.current?.click()}
        >
          <IconPhoto />
        </ActionIcon>
      )}
    </Flex>
  );
}
