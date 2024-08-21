'use client';
import { Button, Checkbox, Textarea, Tooltip } from '@nextui-org/react';
import { IconInfoCircle } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import LocationInput from './LocationInput';
import axios from 'axios';
import { profilePath } from '@/lib/constants';
import { Location } from '@prisma/client';

type InputType = {
  caption: string;
  location: Location | null;
};

type Props = {
  photoId: string;
  disabled?: boolean;
};

export default function PhotoUploadForm({ photoId, disabled }: Props) {
  const { register, handleSubmit } = useForm<InputType>();
  const [loading, setLoading] = useState(false);
  const { user } = useSession().data || {};
  const router = useRouter();
  const [location, setLocation] = useState<InputType['location'] | null>(null);

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setLoading(true);
    console.log(location);
    try {
      if (location) {
        data.location = location;
      }
      await axios.put(`/api/photos/${photoId}`, data);
      router.push(profilePath(user));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} method='POST'>
        <LocationInput location={location} setLocation={setLocation} />
        <Textarea
          className='mt-6'
          label='Caption'
          variant='bordered'
          placeholder='(Optional)'
          {...register('caption')}
        />
        <Button
          color='primary'
          type='submit'
          isLoading={loading}
          className='mt-6 w-full'
          disabled={disabled}
        >
          Save
        </Button>
      </form>
    </div>
  );
}
