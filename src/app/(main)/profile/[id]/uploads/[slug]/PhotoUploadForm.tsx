'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input, Textarea } from '@nextui-org/input';
import React, { useRef } from 'react';
import { Button } from '@nextui-org/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { StandaloneSearchBox, LoadScript } from '@react-google-maps/api';
import PlaceInput from './PlaceInput';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputType>();
  const [loading, setLoading] = React.useState(false);
  const { user } = useSession().data || {};
  const router = useRouter();

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setLoading(true);
    try {
      await axios.post(`/api/photos?userId=${user?.id}`, data);
      router.push(`/${user?.id}`);
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
          <PlaceInput />
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
