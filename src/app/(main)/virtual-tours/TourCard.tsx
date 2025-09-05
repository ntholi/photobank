import { virtualTours } from '@/db/schema';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import Link from 'next/link';

type VirtualTour = typeof virtualTours.$inferSelect;

type Props = {
  tour: VirtualTour;
};

export default function TourCard({ tour }: Props) {
  const url = tour.url;

  return (
    <Card radius='lg' shadow='sm' className='border-default-200/60 border'>
      <CardHeader className='flex flex-col items-start gap-1 p-4'>
        <h3 className='text-base font-semibold'>{tour.name}</h3>
        <p className='text-foreground-500 text-xs'>Virtual tour</p>
      </CardHeader>
      <CardBody className='p-0'>
        <div className='rounded-b-large relative aspect-video w-full overflow-hidden'>
          <iframe
            src={url}
            title={tour.name}
            className='h-full w-full'
            loading='lazy'
            referrerPolicy='no-referrer'
            sandbox='allow-scripts allow-same-origin allow-forms allow-popups'
          />
        </div>
        <div className='flex items-center justify-between gap-3 p-4'>
          <div className='text-foreground-500 truncate text-xs'>{url}</div>
          <Button
            as={Link}
            href={url}
            target='_blank'
            rel='noreferrer'
            size='sm'
            color='primary'
            variant='flat'
          >
            Open
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
