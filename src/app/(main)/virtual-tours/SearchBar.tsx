'use client';

import { Input } from '@heroui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchBar({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    if (debounced) params.set('q', debounced);
    else params.delete('q');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <Input
      value={value}
      onValueChange={setValue}
      placeholder='Search virtual tours...'
      startContent={<IconSearch size={16} />}
      size='sm'
      aria-label='Search virtual tours'
      variant='flat'
    />
  );
}
