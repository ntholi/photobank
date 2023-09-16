'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import { Checkbox } from '@nextui-org/checkbox';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LocationInput from './LocationInput';
import { useState } from 'react';
import { Location } from '@/lib/types';
import { profilePath } from '@/lib/constants';
import { IconInfoCircle } from '@tabler/icons-react';

type InputType = {
  caption: string;
  location: string;
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
        <div className="-mt-6">
          <LocationInput setLocation={setLocation} />
          <Textarea
            className="mt-6"
            label="Caption"
            variant="bordered"
            placeholder="(Optional)"
            {...register('caption')}
          />
          <div className="flex gap-2 items-center">
            <Checkbox className="mt-1" size="sm">
              Allow for homepage display
            </Checkbox>
            <Tooltip
              content={
                <div className="px-1 py-2">
                  <p className="text-small font-bold">Homepage Display</p>
                  <p className="text-tiny mt-1">
                    Allow your photo to be displayed on the homepage without a
                    watermark. <br /> Proper measures will be taken to prevent
                    unauthorized use of your photo.
                  </p>
                </div>
              }
              placement="top"
            >
              <IconInfoCircle size="1rem" className="mt-[15px] text-gray-400" />
            </Tooltip>
          </div>
          <Button
            color="primary"
            type="submit"
            isLoading={loading}
            className="w-full mt-6"
            disabled={disabled}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
