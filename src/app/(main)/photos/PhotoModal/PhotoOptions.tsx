import { Button } from '@nextui-org/react';
import { Photo } from '@prisma/client';
import React from 'react';
import { SlOptions } from 'react-icons/sl';

type Props = {
  photo: Photo;
};

export default function PhotoOptions({ photo }: Props) {
  return (
    <Button isIconOnly size='sm' aria-label='Options' variant='light'>
      <SlOptions className='text-base' />
    </Button>
  );
}
