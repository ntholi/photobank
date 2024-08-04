'use client';
import { profilePath } from '@/lib/constants';
import { Button, Checkbox, Textarea, Tooltip } from '@nextui-org/react';
import { IconInfoCircle } from '@tabler/icons-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import LocationChooser from './LocationChooser';
import { MapLocation } from './MapLocation';
import { Photo } from '@prisma/client';

type InputType = {
  caption: string;
  location: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  };
  useWithoutWatermark: boolean;
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
  const [location, setLocation] = useState<MapLocation | null>(null);
  const [useWithoutWatermark, setUseWithoutWatermark] = useState(false);

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setLoading(true);
    console.log(location);
    try {
      if (location) {
        data.location = {
          id: location.place_id,
          name: location.display_name,
          latitude: Number(location.lat),
          longitude: Number(location.lon),
        };
      }
      data.useWithoutWatermark = useWithoutWatermark;
      // await axios.put(`/api/photos/${photoId}`, data);
      // router.push(profilePath(user));
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
          <LocationChooser location={location} setLocation={setLocation} />
          <Textarea
            className="mt-6"
            label="Caption"
            variant="bordered"
            placeholder="(Optional)"
            {...register('caption')}
          />
          <div className="flex gap-2 items-center">
            <Checkbox
              className="mt-1"
              size="sm"
              checked={useWithoutWatermark}
              onValueChange={setUseWithoutWatermark}
            >
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