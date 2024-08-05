import {
  ActionIcon,
  Divider,
  Flex,
  Image,
  Overlay,
  Stack,
  useMantineColorScheme,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

type Props = {
  disabled?: boolean;
  image: string;
  handleDelete: () => void;
};

export default function ImageDisplay(props: Props) {
  const { disabled, image, handleDelete } = props;
  const { colorScheme } = useMantineColorScheme();
  console.log('Image', image);
  return (
    <Stack w="100%" h="100%" pos="relative">
      <Overlay pos={'absolute'} top={0} h={43} backgroundOpacity={0.2}>
        <Flex justify="end" gap={'sm'} h={'100%'} align={'center'} p={'md'}>
          <ActionIcon
            variant="default"
            disabled={disabled}
            title="Delete"
            onClick={handleDelete}
          >
            <IconTrash size="0.9rem" />
          </ActionIcon>
        </Flex>
        <Divider color={colorScheme === 'light' ? 'gray.6' : undefined} />
      </Overlay>
      <Image src={image} alt="" width="100%" height="100%" fit="contain" />
    </Stack>
  );
}
