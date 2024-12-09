'use client';

import { thumbnail } from '@/lib/config/urls';
import { shorten, stripHtml } from '@/utils';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Image,
} from '@nextui-org/react';
import { Location, LocationDetails, Photo } from '@prisma/client';
import { motion } from 'framer-motion';

interface VirtualTourCardProps {
  location: LocationDetails & {
    location: Location;
    coverPhoto: Photo | null;
  };
}

export function VirtualTourCard({ location }: VirtualTourCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className='h-full'>
        <CardHeader className='flex-col items-center justify-center overflow-hidden p-0'>
          <div className='w-full'>
            <Image
              width={'100%'}
              alt={location.location.name}
              className='h-[200px] w-full object-cover'
              src={thumbnail(location.coverPhoto?.fileName || '')}
              radius='none'
            />
          </div>
        </CardHeader>
        <CardBody>
          <h3 className='mb-2 text-xl font-bold'>{location.location.name}</h3>
          <p className='text-gray-600 dark:text-gray-400'>
            {shorten(stripHtml(location.about))}
          </p>
        </CardBody>
        <CardFooter>
          <Button
            as='a'
            href={`${location.tourUrl}/index.htm` || '#'}
            target='_blank'
            color='primary'
            variant='flat'
            className='w-full'
          >
            Start Virtual Tour
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
