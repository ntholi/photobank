import { ActionIcon, useComputedColorScheme } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useQueryState } from 'nuqs';
import ThemedIconButton from './ThemedIconButton';
import Link from 'next/link';

type Props = {
  disabled?: boolean;
  href?: string;
};

export default function CreateBtn({ disabled, href }: Props) {
  return (
    <Link href={href || ''}>
      <ThemedIconButton
        disabled={disabled}
        title="Create new"
        aria-label="Create new"
      >
        <IconPlus size={'1.2rem'} />
      </ThemedIconButton>
    </Link>
  );
}
