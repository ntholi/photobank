import { ActionIcon, useComputedColorScheme } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useQueryState } from 'nuqs';
import ThemedIconButton from './ThemedIconButton';

type Props = {
  disabled?: boolean;
};

export default function CreateBtn({ disabled }: Props) {
  const [_, setId] = useQueryState('id');
  const [__, setView] = useQueryState('view');

  return (
    <ThemedIconButton
      disabled={disabled}
      title='Create new'
      aria-label='Create new'
      onClick={async () => {
        await setId(null);
        await setView('create');
      }}
    >
      <IconPlus size={'1.2rem'} />
    </ThemedIconButton>
  );
}
