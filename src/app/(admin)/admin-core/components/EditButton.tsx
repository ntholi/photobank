'use client';
import { IconEdit } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemedIconButton from './ThemedIconButton';

type Props = {
  disabled?: boolean;
};

export default function EditButton({ disabled }: Props) {
  const pathname = usePathname();
  return (
    <Link href={`${pathname}/edit`}>
      <ThemedIconButton disabled={disabled} title="Edit" aria-label="Edit">
        <IconEdit size={'1.2rem'} />
      </ThemedIconButton>
    </Link>
  );
}
