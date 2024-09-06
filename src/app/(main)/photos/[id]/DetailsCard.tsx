'use client';
import api from '@/lib/config/api';
import { profilePath } from '@/lib/constants';
import { PhotoWithData } from '@/lib/types';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Link,
} from '@nextui-org/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaBookmark, FaCartArrowDown } from 'react-icons/fa6';
import PricingPlans from './PricingPlans';
import SaveButton from '../SaveButton';

type Props = {
  photo: PhotoWithData;
};

export default function DetailsCard({ photo }: Props) {
  const [price, setPrice] = React.useState('');
  const [purchasing, setPurchasing] = React.useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handlePurchase = async () => {
    if (session) {
      setPurchasing(true);
      axios.post(api(`/photos/${photo.id}/purchase`)).finally(() => {
        setPurchasing(false);
      });
    } else {
      router.push('/signup');
    }
  };

  return (
    <Card>
      <CardHeader className='flex gap-3'>
        <Avatar src={photo.user.image || ''} />
        <div className='flex flex-col'>
          <p className='text-md'>
            {photo.description || <span>No Description</span>}
          </p>
          <Link
            href={profilePath(photo.user)}
            target='_blank'
            className='text-tiny text-default-500'
          >
            {photo.user.name}
          </Link>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <PricingPlans setPrice={setPrice} />
      </CardBody>
      <Divider />
      <CardFooter className='justify-between'>
        <Button
          startContent={<FaCartArrowDown />}
          isLoading={purchasing}
          isDisabled={price !== 'free'}
          color='primary'
          as={Link}
          href={photo.url}
        >
          Download
        </Button>
        <SaveButton photoId={photo.id} />
      </CardFooter>
    </Card>
  );
}
