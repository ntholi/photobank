'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input, Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PlaceInput from './PlaceInput';
import { useEffect, useState } from 'react';
import { Location } from '@/lib/types';
import { profilePath } from '@/lib/constants';
import TagInput from './TagInput';

type InputType = {
  name: string;
  description: string;
  location: string;
  photoUrl: string;
};

type Props = {
  photoUrl: string;
  photoLabels: any[];
};

export default function PhotoUploadForm({ photoUrl, photoLabels }: Props) {
  const { register, handleSubmit } = useForm<InputType>();
  const [loading, setLoading] = useState(false);
  const { user } = useSession().data || {};
  const router = useRouter();
  const [location, setLocation] = useState<Location | null>(null);

  const onSubmit: SubmitHandler<InputType> = async (data: any) => {
    setLoading(true);
    try {
      if (location) {
        data.location = {
          name: location.name,
          lat: location.lat,
          lng: location.lng,
        };
        data.labels = photoLabels;
      }
      await axios.post('/api/photos', data);
      router.push(profilePath(user));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} method="POST">
        <div className="space-y-6">
          <input
            type="text"
            value={photoUrl}
            hidden
            {...register('photoUrl')}
          />
          <Input
            label="Name"
            type="text"
            variant="bordered"
            {...register('name', { required: true })}
          />
          <PlaceInput setLocation={setLocation} />
          <Textarea
            label="Description"
            labelPlacement="outside"
            variant="bordered"
            placeholder="Describe your photo (one sentance story about your photo)"
            {...register('description')}
          />
          <Button
            color="primary"
            type="submit"
            isLoading={loading}
            className="w-full"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
