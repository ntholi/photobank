'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input, Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PlaceInput from './PlaceInput';
import { useState } from 'react';
import { Location } from '@/lib/types';
import { profilePath } from '@/lib/constants';

type InputType = {
  name: string;
  description: string;
  location: string;
  photoUrl: string;
};

type Props = {
  photoUrl: string;
};

export default function PhotoUploadForm({ photoUrl }: Props) {
  const { register, handleSubmit } = useForm<InputType>();
  const [loading, setLoading] = useState(false);
  const { user } = useSession().data || {};
  const router = useRouter();
  const [location, setLocation] = useState<Location | null>(null);

  const onSubmit: SubmitHandler<InputType> = async (data: any) => {
    console.log({ data });
    setLoading(true);
    try {
      if (location) {
        data.location = {
          name: location.name,
          lat: location.lat,
          lng: location.lng,
        };
      }
      await axios.post(`/api/photos?userId=${user?.id}`, data);
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
          <Button type="submit" isLoading={loading} className="w-full">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
