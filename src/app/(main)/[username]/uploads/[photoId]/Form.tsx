'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LocationInput from './LocationInput';
import { useState } from 'react';
import { Location } from '@/lib/types';
import { profilePath } from '@/lib/constants';

type InputType = {
  caption: string;
  location: string;
};

type Props = {
  photoId: string;
  photoLabels: any[];
  disabled?: boolean;
};

export default function PhotoUploadForm({
  photoId,
  photoLabels,
  disabled,
}: Props) {
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
      }
      data.labels = photoLabels;
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
      <form onSubmit={handleSubmit(onSubmit)} method="POST">
        <div className="space-y-6 -mt-6">
          <LocationInput setLocation={setLocation} />
          <Textarea
            label="Caption"
            variant="bordered"
            placeholder="(Optional)"
            {...register('caption')}
          />
          <Button
            color="primary"
            type="submit"
            isLoading={loading}
            className="w-full"
            disabled={disabled}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
