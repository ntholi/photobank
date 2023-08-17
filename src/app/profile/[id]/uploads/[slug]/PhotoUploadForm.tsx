'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input, Textarea } from '@nextui-org/input';
import React from 'react';
import { Button } from '@nextui-org/button';
import axios from 'axios';
import { useSession } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';

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
  const { user } = useSession();
  const router = useRouter();

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setLoading(true);
    try {
      await axios.post(`/api/photos?userId=${user?.uid}`, data);
      router.push(`/profile/${user?.uid}`);
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
          <Input
            label="Location"
            type="text"
            variant="bordered"
            {...register('location', { required: true })}
          />
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
