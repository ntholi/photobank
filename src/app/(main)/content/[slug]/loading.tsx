import Container from '../../base/Container';
import { Skeleton } from '@nextui-org/react';

export default function Loading() {
  return (
    <Container className='py-16'>
      <div className='mx-auto max-w-3xl space-y-4'>
        <Skeleton className='h-12 w-3/4 rounded-lg' />
        <Skeleton className='h-4 w-full rounded-lg' />
        <Skeleton className='h-4 w-full rounded-lg' />
        <Skeleton className='h-4 w-2/3 rounded-lg' />
      </div>
    </Container>
  );
}
