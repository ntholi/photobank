'use client';

import Container from '../../base/Container';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

export default function Error() {
  const router = useRouter();

  return (
    <Container className='py-16'>
      <div className='mx-auto max-w-3xl text-center'>
        <h2 className='text-2xl font-bold'>Something went wrong!</h2>
        <p className='mt-4 text-gray-600'>
          We couldn't load this content. Please try again later.
        </p>
        <Button
          color='primary'
          variant='light'
          onPress={() => router.back()}
          className='mt-6'
        >
          Go Back
        </Button>
      </div>
    </Container>
  );
}
