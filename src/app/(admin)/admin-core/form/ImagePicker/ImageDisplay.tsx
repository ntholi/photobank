import {
  Divider,
  Flex,
  Image,
  Overlay,
  Stack,
  useMantineColorScheme,
} from '@mantine/core';
import { IconCrop, IconTrash } from '@tabler/icons-react';
import ThemedIconButton from '../../components/ThemedIconButton';

type Props = {
  disabled?: boolean;
  image: string;
  showCropper: () => void;
  handleDelete: () => void;
};

export default function ImageDisplay(props: Props) {
  const { disabled, image, showCropper, handleDelete } = props;
  const { colorScheme } = useMantineColorScheme();
  return (
    <Stack w='100%' h='100%' pos='relative'>
      <Overlay pos={'absolute'} top={0} h={43} backgroundOpacity={0.2}>
        <Flex justify='end' gap={'sm'} h={'100%'} align={'center'} p={'md'}>
          <ThemedIconButton
            disabled={disabled}
            title='Crop'
            onClick={showCropper}
          >
            <IconCrop size='1rem' />
          </ThemedIconButton>
          <ThemedIconButton
            disabled={disabled}
            title='Delete'
            onClick={handleDelete}
          >
            <IconTrash size='0.9rem' />
          </ThemedIconButton>
        </Flex>
        <Divider color={colorScheme === 'light' ? 'gray.6' : undefined} />
      </Overlay>
      <Image src={image} alt='' width='100%' height='100%' fit='contain' />
    </Stack>
  );
}
